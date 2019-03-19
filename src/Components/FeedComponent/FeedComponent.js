import React, { Component } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import "./FeedComponent.css";
import FeedCardComponent from "./FeedCardComponent/FeedCardComponent";
import { socket } from "../..";
import LoadComponent from "../LoadComponent/LoadComponent";

class FeedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master_slave_array: []
    };
  }

  componentDidMount() {
    socket.disconnect();
    socket.connect();
    socket.emit("get-master-slave", callback => {
      this.setState({ master_slave_array: callback });
    });
  }

  render() {
    if (this.state.master_slave_array.length > 0) {
      let arr = this.state.master_slave_array;
      return (
        <div>
          <HeaderComponent heading="Feed" />
          <div className="feed-container">
            <h1>Welcome to your FEED</h1>
            <hr />
            <div className="feed-container-cardcontainer">
              <div className="slave-grid">
                {arr.map(res => {
                  return (
                    <div>
                      <FeedCardComponent element={res} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <LoadComponent text={true} />;
    }
  }
}
export default FeedComponent;
