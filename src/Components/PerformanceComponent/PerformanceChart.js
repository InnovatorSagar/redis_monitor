import React, { Component } from "react";
import Performance from "./Performance";
import "../Chart.css";
import { socket } from "../../index";
import DetailChartModal from "../DetailChartModal/DetailChartModal";
import LoadComponent from "../LoadComponent/LoadComponent";
const moment = require("moment");

class PerformanceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      val: [],
      redirect: false,
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "Performance of System",
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
  detailGraphModal = () => {
    const val = [...this.state.values];
    this.setState({ val: val });
    this.setState({ redirect: true });
  };
  closeModal = () => {
    this.setState({ redirect: false });
  };

  componentDidMount() {
    socket.on("info", data => {
      this.change(data.metrics.performanceData);
      if (moment().format("HH:mm:ss") === "00:00:00") {
        this.state.values.splice(0, this.state.values.length);
      }
      this.state.values.push(data.metrics.performanceData);
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
    if (this.state.memory === null) return <LoadComponent />;
    return (
      <div>
        <div className="chart_size" onClick={this.detailGraphModal}>
          Performance: {this.state.memory}
          <Performance
            data={this.state.lineChartData}
            options={this.state.lineChartOptions}
            height={this.state.height}
          />
        </div>
        {this.state.redirect && (
          <DetailChartModal
            heading="Performance Matrix"
            visible={this.state.redirect}
            closeModal={this.closeModal}
          />
        )}
      </div>
    );
  }
}

export default PerformanceComponent;
