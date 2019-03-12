import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class Client extends Component {
  render() {
    const { data, options, height } = this.props;
    return (
      <div>
        <Bar data={data} options={options} height={height} />
      </div>
    );
  }
}

export default Client;
