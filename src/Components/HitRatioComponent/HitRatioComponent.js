import React, { Component } from "react";
import Client from "./HitRatio";
import "../Chart.css";
import { socket } from "../../index";

class ClientChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barChartData: {
        labels: [],
        datasets: [
          {
            type: "bar",
            label: "Hit-Ratio",
            backgroundColor: [
              "orange",
              "orange",
              "orange",
              "orange",
              "orange",
              "orange",
              "orange"
            ],
            borderWidth: "2",
            lineTension: 0.45,
            data: []
          }
        ]
      },
      barChartOptions: {
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
      this.change(data.metrics.usedMemory);
      this.setState({ percentage: this.state.memory });
      const oldDataSet = this.state.barChartData.datasets[0];
      const newDataSet = { ...oldDataSet };
      newDataSet.data.push(this.state.memory);
      if (newDataSet.data.length % 8 === 0) {
        newDataSet.data.shift();
      }
      const newChartData = {
        ...this.state.barChartData,
        datasets: [newDataSet],
        labels: this.state.barChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      if (newChartData.labels.length % 8 === 0) {
        newChartData.labels.shift();
      }
      this.setState({ barChartData: newChartData });
    });
  }

  render() {
    return (
      <div className="chart_size">
        Hit-Ratio: {this.state.memory}
        <Client
          data={this.state.barChartData}
          options={this.state.barChartOptions}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default ClientChart;
