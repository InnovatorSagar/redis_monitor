import React, { Component } from "react";
import "./Header.css";
import { Redirect, Link } from "react-router-dom";
import { socket } from "../..";
const rdbAlertLogo = require("../../assets/logo_2.png");
const user = require("../../assets/user.png");
const home = require("../../assets/home.png");
const feed = require("../../assets/Feed.png");

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: false,
      home: false,
      feed: false
    };

    this.userClick = this.userClick.bind(this);
    this.homeClick = this.homeClick.bind(this);
    this.feedClick = this.feedClick.bind(this);
  }

  userClick() {
    this.setState({ userSettings: true }, () => {});
  }
  homeClick() {
    this.setState({ home: true });
  }
  feedClick() {
    this.setState({ feed: true});
  }

  render() {
    if (this.state.userSettings) return <Redirect to="/Configure" />;
    if (this.state.home) return <Redirect to="/" />;
    if (this.state.feed) return <Redirect to="/feed" />;
    return (
      <header>
        <div className="header">
          <Link to="/">
            <img className="imgclass" src={rdbAlertLogo} alt="rdbAlert-logo" />
          </Link>
          <h3>{this.props.heading}</h3>
          {this.props.heading === "Dashboard" && (
            <section className="buttons">
              <button className="feed-btn" onClick={this.feedClick}>
                <img src={feed} alt="feed" />
                <p>Feed</p>
              </button>
              <button type="submit" className="user-btn" onClick={this.userClick}>
                <img src={user} alt="user" />
                <p>User Settings</p>
              </button>
            </section>
          )}
          {this.props.heading === "Feed" &&  (
            <button type="submit" className="user-btn" onClick={this.userClick}>
              <img src={user} alt="user" />
              <p>User Settings</p>
            </button>
          )}
          {this.props.heading === "Database Configurations" && (
            <button type="submit" className="home-btn" onClick={this.homeClick}>
              <img src={home} alt="user" />
              <p>Home</p>
            </button>
          )}
        </div>
      </header>
    );
  }
}
export default HeaderComponent;