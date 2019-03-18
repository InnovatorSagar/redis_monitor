import React, { Component } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { Redirect } from "react-router-dom";
import "./FeedComponent.css";
import FeedCardComponent from "./FeedCardComponent/FeedCardComponent";
import { socket } from "../..";

class FeedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master_slave_array: []
    };
  }

  componentDidMount() {
    socket.emit("get-master-slave", callback => {
      this.setState({ master_slave_array: callback });
    });
  }

  render() {
    if (this.state.master_slave_array.length > 0) {
      let arr = this.state.master_slave_array;
      return (
        <div className="feed-container">
          <HeaderComponent heading="Feed" />
          <h1>Welcome to your FEED</h1>
          <hr />
          <div className="feed-container-cardcontainer">
            <div className="grid">
              {arr.map(res => {
                return (
                  <div>
                    <FeedCardComponent element={res} />
                    {res.id === 0 && <hr />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return <h3>Loading...</h3>;
    }
  }
}
export default FeedComponent;
