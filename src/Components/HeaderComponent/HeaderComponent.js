import React, { Component } from "react";
import "./Header.css";
import { Redirect, Link } from "react-router-dom";
const rdbAlertLogo = require("../../assets/logo_2.png");
const user = require("../../assets/user.png");
const home = require("../../assets/home.png");

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: false,
      home: false
    };

    this.userClick = this.userClick.bind(this);
    this.homeClick = this.homeClick.bind(this);
  }

  userClick() {
    this.setState({ userSettings: true });
  }
  homeClick() {
    this.setState({ home: true });
  }

  render() {
    if (this.state.userSettings) return <Redirect to="/Configure" />;
    if (this.state.home) return <Redirect to="/" />;
    return (
      <header>
        <div className="header">
          <Link to="/">
            <img className="imgclass" src={rdbAlertLogo} alt="rdbAlert-logo" />
          </Link>
          <h3>{this.props.heading}</h3>
          {this.props.heading !== "Database Configurations" && (
            <button type="submit" onClick={this.userClick}>
              <img src={user} alt="user" />
              <p>User Settings</p>
            </button>
          )}
          {this.props.heading === "Database Configurations" && (
            <button type="submit" onClick={this.homeClick}>
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
