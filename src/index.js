import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./app/App";

axios.defaults.baseURL = "http://localhost:65222";
// axios.defaults.baseURL = "https://lms1210.azurewebsites.net";
// axios.defaults.headers.common.Authorization =
//   "Bearer iBnIk2QjYyTn4fVcgrGfJbBBns7wWF8b_SAqFDcxxup93ybxlChhESuZt53kPOLGX2GF-mfQfWC6M44PBnaGcbK6atcjfMdbDowQEtau0bbLqYKY42oQtfHln3sD66nh8gMrKZAuTlHMqFZsJ0Q_XOUh1dBgILxIok4_JkTkgC4tT1U_p3P1w1lWQYI_L5jKOhekiW03VmvrQfebXRFV6hIRSY8EDlJQxNNg_ZxhwQ0";

ReactDOM.render(<App />, document.getElementById("index"));
