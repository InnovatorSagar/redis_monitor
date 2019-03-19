import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { socket } from "../..";
am4core.useTheme(am4themes_animated);

class DetailChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: null,
      heading: this.props.heading
    };
  }

  componentDidMount() {
    console.log(this.state.heading);
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    socket.emit("data-for-day-graph", callback => {
      this.setState({ values: callback }, () => {
        console.log("recieved", this.state.values);
        chart.paddingRight = 20;
        let dataforchart = [];
        let len = this.state.values.length;
        console.log("length of array", len);

        let hours, minute, seconds, year, month, day;
        this.state.values.map(v => {
          year = parseInt(v.createdAt.substring(0, 4));
          month = parseInt(v.createdAt.substring(5, 7)) - 1;
          day = parseInt(v.createdAt.substring(8, 10));
          hours = parseInt(v.createdAt.substring(11, 13));
          minute = parseInt(v.createdAt.substring(14, 16));
          seconds = parseInt(v.createdAt.substring(17));
          console.log(hours, minute, seconds, year, month, day);
          console.log(v);
          let n = new Date(year, month, day, hours, minute, seconds);
          // n.setSeconds(12);
          console.log("hero", n, "ami", v.createdAt);
          let data = null;
          if (this.state.heading === "Performance Matrix")
            data = v.performanceMetric;
          else if (this.state.heading === "Number Of Clients")
            data = v.noOfClientsMetric;
          else if (this.state.heading === "Hit-Ratio Matrix") data = v.hitRatio;
          else data = v.usedMemoryMetric;
          dataforchart.push({ date: n, value: data });
        });
        chart.data = dataforchart;
      });
    });

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      timeUnit: "second",
      count: 2
    };

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    dateAxis.title.text = "TIME";
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    series.fillOpacity = 0.3;
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    // if(this.state.values === null)
    // return <h3>Loading...</h3>;
    // console.log(this.state);
    return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
  }
}

export default DetailChart;
