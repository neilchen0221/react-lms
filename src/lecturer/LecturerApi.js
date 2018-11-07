import axios from "axios";

export async function getLecturers() {
  const response = await axios.get(`/api/lecturers`);
  return response.data;
}

export async function getLecturersById(id) {
  const response = await axios.get(`/api/lecturers/${id}`);
  return response.data;
}
