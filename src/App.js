import React, { Component } from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChangeValue from "./Components/PerformanceComponent/changeValue";
import store from "./store";
import HomeComponent from "./Components/HomeComponent/HomeComponent";
import ClientChart from "./Components/ClientComponent/ClienChart";
import MemoryChart from "./Components/MemoryComponent/MemoryChart";
import DashboardComponent from "./Components/DashboardComponent/DashboardComponent";
import FormComponent from "./Components/FormComonent/FormComponent";
import io from "socket.io-client";
const socket = io();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={HomeComponent} />
            <Route exact path="/Memory" component={MemoryChart} />
            <Route exact path="/Client" component={ClientChart} />
            <Route exact path="/performance" component={ChangeValue} />
            <Route exact path="/dashboard" component={DashboardComponent} />
            <Route exact path="/Configure" component={FormComponent} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export { App, socket };
