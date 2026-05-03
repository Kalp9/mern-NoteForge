import axios from "axios";
import e from "cors";

const api = axios.create({
  baseURL: "http://localhost:5000",
 
});

export default api;