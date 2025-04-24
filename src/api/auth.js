import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-937324960970.us-central1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
