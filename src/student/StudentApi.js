import axios from "axios";

export function getStudents(pageNumber = 1) {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/students?pageNumber=${pageNumber}`)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data);
        } else {
          reject(response.response);
        }
      })
      .catch(reject);
  });
}
