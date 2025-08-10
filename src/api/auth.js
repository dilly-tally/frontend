import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-164859304804.us-central1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
