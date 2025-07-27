import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-844313246496.europe-west1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
