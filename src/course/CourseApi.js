import axios from "axios";

export async function getCourses() {
  const response = await axios.get("/api/courses");
  return response.data;
}
