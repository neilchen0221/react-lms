import axios from "axios";
import { pick } from "lodash/object";

export function getStudents(pageNumber = 1, searchValue = "") {
  let searchValueUrl = searchValue ? `&searchValue=${searchValue}` : "";

  return new Promise((resolve, reject) => {
    axios
      .get(`/api/students?pageNumber=${pageNumber}${searchValueUrl}`)
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

export async function getStudentById(id) {
  const response = await axios.get(`/api/students/${id}`);
  return response.data;
}

export async function createStudent(student) {
  const response = await axios.post(`/api/students`, student);
  return response.data;
}

export async function updateStudent(id, student) {
  const data = pick(student, ["firstName", "lastName", "gender", "dateOfBirth", "email", "credit"]);
  const response = await axios.put(`/api/students/${id}`, data);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axios.delete(`/api/students/${id}`);
  return response.data;
}
