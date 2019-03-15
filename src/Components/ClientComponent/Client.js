import React, { Component } from "react";
import { Line } from "react-chartjs-2";
//import zoom from 'chartjs-plugin-zoom';
class Client extends Component {
  render() {
    const { data, options, height, zoom } = this.props;
    return (
      <div>
        <Line data={data} options={options} height={height} zoom={zoom}/>
      </div>
    );
  }
}

export default Client;
