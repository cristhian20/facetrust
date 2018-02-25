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

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// client.get("favorites/list", function(error, tweets, response) {
//   if (error) throw error;
//   console.log(tweets); // The favorites.
//   console.log(response); // Raw response object.
// });

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

app.use(express.static(path.resolve(__dirname, "../", "build")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.options("*", function(req, res) {
  "use strict";
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

// app.use("/account", router);

app.post("/tweet", (req, res) => {
  switch (req.body.code) {
    case 1:
    //send tweet to one single person
    //picture on dashboard
    case 2:
    //collect tweets from the area
    //dashboard
    case 3:
      //send tweets out to #hashtag
      //dashboard of responses to this tweet
      break;
  }

  console.log(req.body);
});

//catch all handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});
const port = process.env.PORT || 9001;
const server = app.listen(port);
console.log(`express app listening on port ${port}`);

const websocket = socketio(server);

websocket.on("connection", socket => {
  socket.on("start-tweets", tweet => {
    websocket.sockets.emit("tweets", data.body.tracks.items);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
