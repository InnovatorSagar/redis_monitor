import React, { Component } from "react";
import HitRatio from "./HitRatio";
import "../Chart.css";
import { socket } from "../../index";
import DetailChartModal from "../DetailChartModal/DetailChartModal";
import LoadComponent from "../LoadComponent/LoadComponent";

class HitRatioChart extends Component {
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
            label: "Hit-Ratio",
            borderColor: "#00BFFF",
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
      let hitRatio = data.metrics.hitRatio;
      if (isNaN(hitRatio)) {
        hitRatio = 0;
      }
      this.change(hitRatio);
      this.state.values.push(hitRatio);
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
          Hit-Ratio: {this.state.memory}
          <HitRatio
            data={this.state.lineChartData}
            options={this.state.lineChartOptions}
            height={this.state.height}
          />
        </div>
        {this.state.redirect && (
          <DetailChartModal
            heading="Hit-Ratio Matrix"
            visible={this.state.redirect}
            closeModal={this.closeModal}
          />
        )}
      </div>
    );
  }
}

export default HitRatioChart;
