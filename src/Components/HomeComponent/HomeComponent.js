import React, { Component } from "react";
import bg from "../../assets/bg.jpg";
import logo from "../../assets/logo.png";
import "./HomeComponent.css";
import { Redirect } from "react-router-dom";
import ModalComponent from "../ModalComponent/ModalComponent";
import { socket } from "../../index";

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rdbConfiguration: false,
      openModal: false,
      dashboard: false
    };
    this.rdbConfiguration = this.rdbConfiguration.bind(this);
    this.dashboard = this.dashboard.bind(this);
  }

  rdbConfiguration() {
    this.setState({ rdbConfiguration: true });
  }
  dashboard() {
    socket.emit("startConfig", "hero");
    socket.emit("send-data", done => {
      if (!done) {
        this.setState({ openModal: true });
      } else {
        this.setState({ dashboard: true });
      }
    });
  }
  render() {
    if (this.state.rdbConfiguration) return <Redirect to="/Configure" />;
    if (this.state.dashboard) return <Redirect to="/dashboard" />;
    return (
      <div className="app-contain">
        {this.state.openModal && <ModalComponent />}
        <img src={bg} alt="homeimage" className="home-image" />
        <div className="main">
          <img src={logo} alt="homeimage" className="logo" />
          <h1>RDBAlert</h1>
          <p>
            RDBALERT is an open source redis-server monitoring tool which allows
            a developer to get ful control of their redis server.
          </p>
          <div className="signup-login">
            <button
              type="rdbConfiguration"
              className="rdbConfiguration-btn"
              onClick={this.rdbConfiguration}
            >
              RDBCONFIGURATION
            </button>
            <button
              type="dashboard"
              className="dashboard-btn"
              onClick={this.dashboard}
            >
              FEED
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
