import axios from "axios";

// Point at the Django dev server on the SAME host the page was opened from.
// On the computer that's localhost; on a phone it's the computer's LAN IP.
const client = axios.create({
  baseURL: `http://${window.location.hostname}:8000/api`,
});

export default client;
