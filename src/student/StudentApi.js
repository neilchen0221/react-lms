import axios from "axios";
import { pick } from "lodash/object";

export function getStudents(pageNumber = 1, searchValue = "", sortString = "", sortOrder = true) {
  let searchValueUrl = searchValue ? `&searchValue=${searchValue}` : "";
  let sortStringUrl = sortString ? `&sortString=${sortString}` : "";
  let sortOrderUrl = sortOrder ? `&sortOrder=asc` : "&sortOrder=desc";

  return new Promise((resolve, reject) => {
    axios
      .get(`/api/students?pageNumber=${pageNumber}${searchValueUrl}${sortStringUrl}${sortOrderUrl}`)
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
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/students`, student)
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

export async function updateStudent(id, student) {
  const data = pick(student, ["firstName", "lastName", "gender", "dateOfBirth", "email", "credit"]);
  const response = await axios.put(`/api/students/${id}`, data);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axios.delete(`/api/students/${id}`);
  return response.data;
}

export async function getStudentCourse(id) {
  const response = await axios.get(`/api/studentcourse/${id}`);
  return response.data;
}

export function enrollCourse(studentId, courseId) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/students/enrollcourse?studentId=${studentId}&courseId=${courseId}`)
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

export async function cancelCourse(studentId, courseId) {
  await axios.post(`/api/students/cancelcourse?studentId=${studentId}&courseId=${courseId}`);
}
