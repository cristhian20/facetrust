import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SocketIOClient from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: ["tweet1", "tweet2"]
    };
    // this.socket = SocketIOClient(`http://${IP}:${9001}`);
  }
  componentDidMount() {
    // this.socket.on("tweets", tweets => {
    //   this.setState({ tweets });
    // });
  }
  update() {}
  render() {
    const { tweets } = this.state;
    return (
      <div className="App">
        <header className="header">
          <h1>FyreWatch</h1>
        </header>
        <main>
          <div className="tweet-list">
            {tweets.map((tweet, i) => <li className="tweet">{tweet}</li>)}
          </div>
          <div className="featured-image" />
        </main>
      </div>
    );
  }
}

export default App;
