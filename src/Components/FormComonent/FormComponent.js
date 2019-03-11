import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./FormComponent.css";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FormDataConfirmationModal from "../ModalComponent/FormDataConfirmationModal";
import { socket } from "../../App.js";

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      thersholdMemory: "",
      thresholdCpuPerformance: "",
      thresholdNoOfClients: "",
      hitratiometric: "",
      organization: "",
      port: "",
      databasePass: "",
      databaseHost: "",
      redirect: false,
      sentData: false,
      haveData: false
    };
  }

  closeModal = () => {
    this.setState({ redirect: false });
  };

  validate = () => {
    let validIpformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    let emailvar = this.state.email;
    let databaseHostvar = this.state.databaseHost;
    let res = true;
    if (emailvar.indexOf("@") === -1) {
      this.setState({ email: "" });
      res = false;
    }
    if (!databaseHostvar.match(validIpformat)) {
      this.setState({ databaseHost: "" });
      res = false;
    }

    return res;
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ redirect: false });
  };

  handleSubmit = event => {
    event.preventDefault();
    const res = this.validate();
    this.setState({ redirect: true });
    if (res) {
      const data = {
        name: this.state.name,
        email: this.state.email,
        thersholdMemory: this.state.thersholdMemory,
        thresholdCpuPerformance: this.state.thresholdCpuPerformance,
        thresholdNoOfClients: this.state.thresholdNoOfClients,
        organization: this.state.organization,
        port: this.state.port,
        thresholdHitRatio: this.state.hitratiometric,
        databasePass: this.state.databasePass,
        databaseHost: this.state.databaseHost
      };
      this.setState({ redirect: true });
      if (this.state.haveData)
        socket.emit("update-user-config", data, callback => {
          if (callback != null)
            this.setState({
              sentData: true
            });
        });
      else
        socket.emit("user-config", data, callback => {
          if (callback) this.setState({ sentData: true });
        });
    }
  };

  componentDidMount() {
    socket.emit("get-user-data", callback => {
      if (callback != null) {
        this.setState({
          name: callback.name,
          email: callback.email,
          thersholdMemory: callback.thersholdMemory,
          thresholdCpuPerformance: callback.thresholdCpuPerformance,
          thresholdNoOfClients: callback.thresholdNoOfClients,
          hitratiometric: callback.thresholdHitRatio,
          organization: callback.organization,
          port: callback.port,
          databasePass: callback.databasePass,
          databaseHost: callback.databaseHost,
          haveData: true
        });
      }
    });
  }
  render() {
    console.log("redirect", this.state.sentData);
    let button = "Submit";
    if (this.state.haveData) button = "Update";
    return (
      <div className="form-container">
        <FormDataConfirmationModal
          visible={this.state.redirect}
          closeModal={this.closeModal}
          sentData={this.state.sentData}
          haveData={this.state.haveData}
        />
        <HeaderComponent heading="Database Configurations" />
        <h3>DATABASE CONFIGURATIONS</h3>
        <hr />
        <div className="form">
          <p className="alignPersonalText">Personal Information</p>
          <form onSubmit={e => this.handleSubmit(e)}>
            <section>
              <p className="alignInputText">Name:</p>
              <input
                type="text"
                className="inputfield"
                name="name"
                value={this.state.name}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Email:</p>
              <input
                type="text"
                className="inputfield"
                name="email"
                value={this.state.email}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Organisation:</p>
              <input
                type="text"
                className="inputfield"
                name="organization"
                value={this.state.organization}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <p className="alignDatabaseText">Redis-Server Information</p>
            <section>
              <p className="alignInputText">Port:</p>
              <input
                type="text"
                className="inputfield"
                name="port"
                value={this.state.port}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Password:</p>
              <input
                type="password"
                className="inputfield"
                name="databasePass"
                value={this.state.databasePass}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">IP Address/ URL:</p>
              <input
                type="text"
                className="inputfield"
                name="databaseHost"
                value={this.state.databaseHost}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Memory Threshold:</p>
              <input
                type="text"
                className="inputfield"
                placeholder="Set Memory Limit(Bytes)"
                name="thersholdMemory"
                value={this.state.thersholdMemory}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Number of Clients</p>
              <input
                type="text"
                className="inputfield"
                placeholder="Set Limit of Clients"
                name="thresholdNoOfClients"
                value={this.state.thresholdNoOfClients}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Performance Requirement</p>
              <input
                type="text"
                className="inputfield"
                placeholder="Enter minimum Performance Required in Percent"
                name="thresholdCpuPerformance"
                value={this.state.thresholdCpuPerformance}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <p className="alignInputText">Hit Ratio</p>
              <input
                type="text"
                className="inputfield"
                placeholder="Enter minimum Hit Ratio"
                name="hitratiometric"
                value={this.state.hitratiometric}
                onChange={e => this.handleChange(e)}
                required
              />
            </section>
            <section>
              <Link to="/">
                <button className="cancel-btn" type="secondary">
                  Cancel
                </button>
              </Link>
              <button
                className="submit-btn"
                type="submit"
                onClick={this.handleSubmit}
              >
                {button} >
              </button>
            </section>
          </form>
        </div>
      </div>
    );
  }
}
export default FormComponent;
