import React, { Component } from "react";
import ClientMain from "./ClientMain";
import { Chart } from "react-chartjs-2";
import zoom from 'chartjs-plugin-zoom';
// import Hammer from 'hammerjs';
import { socket } from "../../index";

class ClientMainChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Number of Clients of System",
            borderColor: "orange",
            borderWidth: "2",
            lineTension: 0.45,
            data: []
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0
              }
            }
          ]
        },
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom:{
        enabled: true,
        mode: 'x'
      }
    },
    height: 160,
    memory: null
  };
}
  change(d, u) {
    this.setState(prevState => ({
      max: u,
      memory: d,
    }));
  }
  componentDidMount() {
    Chart.plugins.register(zoom);
    socket.on("info", data => {
      this.change(data.metrics.numberOfClient, data.metrics);
      const oldDataSet = this.state.lineChartData.datasets[0];
      const newDataSet = { ...oldDataSet };
      newDataSet.data.push(this.state.memory);
    //   if (newDataSet.data.length % 8 === 0) {
    //     newDataSet.data.shift();
    //   }
      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
    //   if (newChartData.labels.length % 8 === 0) {
    //     newChartData.labels.shift();
    //   }
      this.setState({ lineChartData: newChartData });
    });
  }

  render() {
    return (
      <div>
        Number of Clients: {this.state.memory}
        <ClientMain
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
          height={this.state.height}
          // zoom={this.state.zoom}
          // pan={this.state.pan}
        />
      </div>
    );
  }
}

export default ClientMainChart;
