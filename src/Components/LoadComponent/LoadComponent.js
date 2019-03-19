import React from "react";
import { css } from "@emotion/core";
// First way to import
import { PulseLoader } from "react-spinners";
// Another way to import

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class LoadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <div className="sweet-loading">
        <PulseLoader
          css={override}
          sizeUnit={"px"}
          size={30}
          color={"grey"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default LoadComponent;
