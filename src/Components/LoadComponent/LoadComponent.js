import React from "react";
import { css } from "@emotion/core";
// First way to import
import { PulseLoader } from "react-spinners";
import "./LoadComponent.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class LoadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      text: this.props.text
    };
  }
  render() {
    return (
      <div className="sweet-loading">
        <PulseLoader
          css={override}
          sizeUnit={"px"}
          size={20}
          color={"grey"}
          loading={this.state.loading}
        />
        {this.state.text && <h3>Just give us few moments...</h3>}
      </div>
    );
  }
}

export default LoadComponent;
