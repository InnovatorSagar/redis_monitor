import React, { Component } from "react";
import "./FeedCardComponent.css";

class FeedCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.element.id,
      port: this.props.element.port
    };
  }
  render() {
    return (
      <div className="feed-card-cards" onClick={this.handleClick}>
        {this.state.id === 0 && <h3>Master</h3>}
        {this.state.id !== 0 && <h3>Slave : {this.state.id}</h3>}
        <hr />
        <p>Port: {this.state.port}</p>
      </div>
    );
  }
}

export default FeedCardComponent;
