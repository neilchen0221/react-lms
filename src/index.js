import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./app/App";

axios.defaults.baseURL = "http://localhost:65222";
// axios.defaults.baseURL = "https://lms1210.azurewebsites.net";
// axios.defaults.headers.common.Authorization =
//   "Bearer lOjQtITWqPts6dPGfODU_aleZQiMBOWoQvqMIjdr9-65HcYWVp3kRq1nCuuhWop5Z0zEFrP-jWvz0BW3YxXlZEfPLdKLtxiB6SPI8T2RhKN3eh0zvEBu7nzhKUrV-Oj-8Owr52vy2sqnQ8Rm7SmdgKVvjDvhKQtzkQB-GevrpbigjjYWw04AGpS3OKTUl6NFRlqSfab7lok9HIEJbA-HGLPG1edZvemGtyOnZJuQXVY";

ReactDOM.render(<App />, document.getElementById("index"));
