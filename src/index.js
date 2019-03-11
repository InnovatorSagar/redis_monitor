import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import io from "socket.io-client";
let url = null;
if (process.env.NODE_ENV === "production") {
  url = `https://rdbalert.herokuapp.com:${process.env.PORT_NUMBER}`;
} else {
  url = `http://localhost:4000`;
}

console.log(process.env.PORT_NUMBER, process.env.PORT);
const socket = io.connect(url);
console.log(url);
socket.emit("d", c => {
  console.log(c);
});
ReactDOM.render(<App />, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
export { socket };
