import React, { Component } from "react";
import Modal from "react-awesome-modal";
import "./DescriptionModalComponent.css";
import { socket } from "../../App.js";

class DescriptionModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startingdate: "",
      endingdate: "",
      dataFromDatabase: false,
      data: null,
      arrayOfData: []
    };
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleClick = event => {
    let type = "Performance Data";
    if (this.props.heading === "Performance Matrix") type = 3;
    else if (this.props.heading === "Memory Matrix") type = 1;
    else if (this.props.heading === "Number Of Clients Matrix") type = 2;
    else type = 4;
    this.setState({ dataFromDatabase: true }, () => {
      socket.emit(
        "get-data-between-two-dates",
        this.state.startingdate,
        this.state.endingdate,
        type,
        d => {
          this.setState(
            {
              data: d
            },
            () => {
              var arr = [];
              let unit = "";
              if (type === 1) unit = "KB";
              else if (type === 2) unit = null;
              else if (type === 3) unit = "UNITS";
              else unit = "%";
              for (let i = 0; i < this.state.data.length; i++) {
                arr.push(<span>{d[i].date}</span>);
                arr.push(
                  <span>
                    {d[i].data}
                    {unit}
                  </span>
                );
              }
              //console.log(arr);
              this.setState({ arrayOfData: arr });
            }
          );
        }
      );
    });

    // event.preventDefault();
  };
  render() {
    const { visible, closeModal, heading } = this.props;
    return (
      <section>
        {this.state.dataFromDatabase && this.state.data !== null && (
          <Modal visible={visible} effect="fadeInUp" width="400" height="300">
            <div className="data-container">
              <h1>{heading}</h1>
              <div className="grid-data">
                <span>
                  <strong>Date</strong>
                </span>
                <span>
                  <strong>Matrix Data</strong>
                </span>
                {
                  /* {this.state.data.map(curr_data => {
                  return (
                      <span>{curr_data.date}</span>
                      <span>{curr_data.data}</span>
                  );
                })} */
                  this.state.arrayOfData
                }
              </div>
              <section>
                <button className="cancel-btn" onClick={closeModal}>
                  Close
                </button>
              </section>
            </div>
          </Modal>
        )}
        {!this.state.dataFromDatabase && (
          <Modal visible={visible} width="500" height="240" effect="fadeInUp">
            <div className="description-container">
              <h1>{heading}</h1>
              <hr />
              <section>
                <label>Starting Date</label>
                <input
                  type="date"
                  name="startingdate"
                  value={this.state.startingdate}
                  onChange={e => this.handleChange(e)}
                />
              </section>
              <section>
                <label>Ending Date </label>
                <input
                  type="date"
                  name="endingdate"
                  value={this.state.endingdate}
                  onChange={e => this.handleChange(e)}
                />
              </section>
              <section>
                <button
                  className="proceed-btn"
                  onClick={e => this.handleClick(e)}
                >
                  Proceed
                </button>
                <button className="cancel-btn" onClick={closeModal}>
                  Close
                </button>
              </section>
            </div>
          </Modal>
        )}
      </section>
    );
  }
}

export default DescriptionModalComponent;
