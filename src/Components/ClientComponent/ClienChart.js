import React, { Component } from "react";
import Client from "./Client";
import "../Chart.css";
import { socket } from "../../index";

class ClientChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Number of Clients of System",
            backgroundColor: "orange",
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
        }
      },
      height: 160,
      memory: null
    };
  }
  change(d) {
    this.setState(prevState => ({
      memory: d
    }));
  }

  componentDidMount() {
    socket.on("info", data => {
      this.change(data.metrics.numberOfClient);
      this.setState({ percentage: this.state.memory });
      const oldDataSet = this.state.lineChartData.datasets[0];
      const newDataSet = { ...oldDataSet };
      newDataSet.data.push(this.state.memory);
      if (newDataSet.data.length % 8 === 0) {
        newDataSet.data.shift();
      }
      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      if (newChartData.labels.length % 8 === 0) {
        newChartData.labels.shift();
      }
      this.setState({ lineChartData: newChartData });
    });
  }

  render() {
    return (
      <div className="chart_size">
        Number of Clients: {this.state.memory}
        <Client
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default ClientChart;
