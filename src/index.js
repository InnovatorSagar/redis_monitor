import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import io from "socket.io-client";
let url = null;

fetch("https://localhost:4000/port_adress", function(res, err) {
  console.log(res);
});
if (process.env.NODE_ENV === "production") {
  url = "/";
} else {
  url = `http://localhost:4000`;
}

console.log(process, process.env);
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
