import axios from "axios";
import { pick } from "lodash/object";

export async function getLecturers() {
  const response = await axios.get(`/api/lecturers`);
  return response.data;
}

export async function getLecturerById(id) {
  const response = await axios.get(`/api/lecturers/${id}`);
  return response.data;
}

export async function createLecturer(lecturer) {
  const response = await axios.post(`/api/lecturers`, lecturer);
  return response.data;
}

export async function updateLecturer(id, lecturer) {
  const data = pick(lecturer, ["name", "staffNumber", "email", "bibliography"]);
  const response = await axios.put(`/api/lecturers/${id}`, data);
  return response.data;
}

export async function deleteLecturer(id) {
  const response = await axios.delete(`/api/lecturers/${id}`);
  return response.data;
}
