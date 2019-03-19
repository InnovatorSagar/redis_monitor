import React, { Component } from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import store from "./store";
import HomeComponent from "./Components/HomeComponent/HomeComponent";
import DashboardComponent from "./Components/DashboardComponent/DashboardComponent";
import FormComponent from "./Components/FormComonent/FormComponent";
import FeedComponent from "./Components/FeedComponent/FeedComponent";
let hashHistory = Router.hashHistory;
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <div className="App">
            <Route exact path="/" component={HomeComponent} />
            <Route exact path="/dashboard" component={DashboardComponent} />
            <Route exact path="/Configure" component={FormComponent} />
            <Route exact path="/feed" component={FeedComponent} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
