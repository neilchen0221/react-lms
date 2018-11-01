import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./app/App";

// axios.defaults.baseURL = "http://localhost:65222";
axios.defaults.baseURL = "https://lms1210.azurewebsites.net";
axios.defaults.headers.common.Authorization =
  "Bearer mY1LnE1NBk0lahJnBoNeT_GHmBm_36rWgC0yZhHfg1zW-osgz9AETVQLs66UyH7X3XEQs6_JUQcU2clAysHpDEzJk0W_bUPyK3WomCUj-thq3sgxMjnbBxjtjNhB3eWhAF5aZo8b-NaPDdgDh-T4mcSzNrh5pyVuw5b7YilNlYAQhkSR5WettvHOKbmJly_E8c0KAb8TxUmz4BbPd7yfSzrV3VWNlNrS76hDLT1_q6c";

ReactDOM.render(<App />, document.getElementById("index"));
