import axios from "axios";

export async function getCourses() {
  const response = await axios.get("/api/courses");
  return response.data;
}

export async function getCourseById(id) {
  const response = await axios.get(`/api/courses/${id}`);
  return response.data;
}
