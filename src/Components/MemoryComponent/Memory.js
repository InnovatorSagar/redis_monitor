import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class Memory extends Component {
  render() {
    const { data, options, height } = this.props;
    return (
      <div>
        <Line data={data} options={options} height={height} />
      </div>
    );
  }
}

export default Memory;
