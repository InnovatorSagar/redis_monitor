import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./FormComponent.css";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FormDataConfirmationModal from "../ModalComponent/FormDataConfirmationModal";
import { socket } from "../../index";

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      thresholdMemory: "",
      thresholdCpuPerformance: "",
      thresholdNoOfClients: "",
      hitratiometric: "",
      organization: "",
      port: "",
      databasePass: "",
      databaseHost: "",
      redirect: false,
      sentData: false,
      haveData: false,
      error_wala: false
    };
  }

  closeModal = () => {
    console.log("Closing modal");
    this.setState({ redirect: false });
  };

  validate = () => {
    let emailVar = this.state.email;
    let hitRatioVar = this.state.hitratiometric;
    //let thersholdMemoryVar = this.state.thersholdMemory;
    let res = true;
    if (
      this.state.name === "" ||
      this.state.thresholdMemory === "" ||
      this.state.thresholdCpuPerformance === "" ||
      this.state.thresholdNoOfClients === "" ||
      this.state.hitratiometric === "" ||
      this.state.organization === "" ||
      this.state.port === "" ||
      this.state.databaseHost === "" ||
      this.state.databasePass === ""
    ) {
      res = false;
      this.setState({ error_wala: true });
    }
    if (emailVar.indexOf("@") === -1) {
      this.setState({ email: "" });
      this.setState({ error_wala: true });
      res = false;
    }
    if (parseInt(hitRatioVar) >= 1) {
      this.setState({ hitratiometric: "" });
      this.setState({ error_wala: true });
      res = false;
    }
    return res;
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ redirect: false });
  };

  handleSubmit = event => {
    // socket.disconnect();
    // socket.connect();
    event.preventDefault();
    const res = this.validate();
    this.setState({ redirect: true });
    if (res) {
      this.setState({ error_wala: false });
      const data = {
        name: this.state.name,
        email: this.state.email,
        thresholdMemory: this.state.thresholdMemory,
        thresholdCpuPerformance: this.state.thresholdCpuPerformance,
        thresholdNoOfClients: this.state.thresholdNoOfClients,
        organization: this.state.organization,
        port: this.state.port,
        thresholdHitRatio: this.state.hitratiometric,
        databasePass: this.state.databasePass,
        databaseHost: this.state.databaseHost
      };
      this.setState({ redirect: true });
      if (this.state.haveData) {
        socket.emit("update-user-config", data, callback => {
          if (!callback) {
            this.setState(
              {
                error_wala: true,
                sentData: false
              },
              () => {}
            );
          }
          if (callback) {
            this.setState(
              {
                sentData: true,
                error_wala: false
              },
              () => {}
            );
          }
        });
      } else
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
          thresholdMemory: callback.thresholdMemory,
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
    let button = "Submit";
    if (this.state.haveData) button = "Update";
    // console.log("Form state ", this.state);
    return (
      <div>
        {this.state.sentData && (
          <FormDataConfirmationModal
            visible={this.state.redirect}
            closeModal={this.closeModal}
            sentData={this.state.sentData}
            haveData={this.state.haveData}
          />
        )}
        {this.state.error_wala && (
          <FormDataConfirmationModal
            visible={this.state.redirect}
            closeModal={this.closeModal}
            sentData={this.state.sentData}
            haveData={this.state.haveData}
          />
        )}
        <HeaderComponent heading="Database Configurations" />
        <div className="form-container">
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
                <p className="alignInputText">Master Port:</p>
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
                <p className="alignInputText">Master Password:</p>
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
                <p className="alignInputText">Master IP Address/ URL:</p>
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
                  name="thresholdMemory"
                  value={this.state.thresholdMemory}
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
      </div>
    );
  }
}
export default FormComponent;
