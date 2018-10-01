import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "./history";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
