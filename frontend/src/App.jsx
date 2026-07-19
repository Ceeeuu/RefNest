import { useEffect, useState } from "react";
import client from "./api/client";

function App() {
  const [status, setStatus] = useState("connecting...");

  useEffect(() => {
    client
      .get("/ping/")
      .then((res) => setStatus(`connected: ${JSON.stringify(res.data)}`))
      .catch((err) => setStatus(`failed: ${err.message}`));
  }, []);

  return (
    <main style={{ fontFamily: "serif", padding: "3rem", textAlign: "center" }}>
      <h1>RefNest</h1>
      <p>Backend status: {status}</p>
    </main>
  );
}

export default App;
