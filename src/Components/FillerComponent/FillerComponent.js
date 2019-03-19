import React, { Component } from "react";
import "./FillerComponent.css";

class Filler extends Component {
  render() {
    const { percentage, color } = this.props;
    // console.log(percentage);
    return (
      <div
        className="filler"
        style={{ background: color, width: percentage }}
      />
    );
  }
}

export default Filler;
