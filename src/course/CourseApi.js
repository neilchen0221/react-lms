import axios from "axios";
import { pick } from "lodash/object";

export async function getCourses() {
  const response = await axios.get("/api/courses");
  return response.data;
}

export async function getCourseById(id) {
  const response = await axios.get(`/api/courses/${id}`);
  return response.data;
}

export async function createCourse(course) {
  const response = await axios.post(`/api/courses`, course);
  return response.data;
}

export async function updateCourse(id, course) {
  const data = pick(course, ["title", "language", "fee", "maxStudent", "description"]);
  const response = await axios.put(`/api/courses/${id}`, data);
  return response.data;
}

export async function deleteCourse(id) {
  const response = await axios.delete(`/api/courses/${id}`);
  return response.data;
}
