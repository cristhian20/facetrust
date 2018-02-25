import express from "express";
import morgan from "morgan";
// import router from "./router";
const path = require("path");
var fs = require("fs");
import session from "express-session";
import bodyParser from "body-parser";
import Twitter from "twitter";
// import multer from "multer";
// import async from "async";
require("dotenv").config();
import socketio from "socket.io";
import SocketIOClient from "socket.io-client";
import socket_stream from "socket.io-stream";

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// client.post("statuses/update", { status: "I Love Twitter" }, function(
//   error,
//   tweet,
//   response
// ) {
//   if (error) throw error;
//   console.log(tweet); // Tweet body.
//   console.log(response); // Raw response object.
// });

// fs.readdirSync(__dirname + "/models").forEach(function(filename) {
//   if (~filename.indexOf(".js")) require(__dirname + "/models/" + filename);
// });

const app = express();

app.use(morgan("combined"));

app.use(express.static(path.resolve(__dirname, "../client/", "build")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.options("*", function(req, res) {
  "use strict";
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

// app.use("/account", router);

var image;

app.get("/image", (req, res) => {
  res.send({ image: image });
});

app.post("/tweet", (req, res) => {
  const client = SocketIOClient(`http://${"localhost"}:${9002}`);
  console.log(req.body);
  image = req.body.picture;
  switch (req.body.code) {
    case "1":
      //send tweet to one single person
      //picture on dashboard
      client.emit("start-tweets", "#fyreboulder", req.body.picture);
      break;
    case "2":
      //collect tweets from the area
      //dashboard
      client.emit("start-tweets", "firelongmont", req.body.picture);
      break;
    case "3":
      //send tweets out to #hashtag
      //dashboard of responses to this tweet
      client.emit("start-tweets", "firedenver", req.body.picture);
      break;
    default:
      client.emit("start-tweets", "#fyreboulder", req.body.picture);
      break;
  }
});

//catch all handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "client/build", "index.html"));
});
const port = process.env.PORT || 9002;
const server = app.listen(port);
console.log(`express app listening on port ${port}`);

const websocket = socketio(server);

websocket.on("connection", socket => {
  socket.on("start-tweets", (hashtag, imageData) => {
    console.log("starting tweets");
    console.log(hashtag);
    console.log(imageData);
    client.get("search/tweets", { q: hashtag, count: 100 }, function(
      error,
      tweets,
      response
    ) {
      // if (error) throw error;
      console.log("starting tweets");
      console.log(tweets); // The tweets.
      // console.log(tweets.statuses); // The tweets.
      websocket.sockets.emit(
        "tweets",
        tweets.statuses,
        imageData ? imageData.join("") : 0
      );
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
