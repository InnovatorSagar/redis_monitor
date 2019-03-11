import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class Performance extends Component {
  render() {
    const { data, options, height } = this.props;
    return <Line data={data} options={options} height={height} width={100} />;
  }
}

export default Performance;
