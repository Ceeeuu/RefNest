import axios from "axios";

// All API calls go through this client. baseURL points at the Django dev server.
const client = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default client;
