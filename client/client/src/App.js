import React, { useEffect, useState } from "react";

function App() {
  const [backendTime, setBackendTime] = useState("Loading...");

  useEffect(() => {
    fetch("/api/test-db")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBackendTime(data.time);
        else setBackendTime("Error: " + data.error);
      })
      .catch(() => setBackendTime("Could not connect to backend."));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>PERN Demo Website</h1>
      <p>
        <b>Backend PostgreSQL Time:</b> {backendTime}
      </p>
    </div>
  );
}

export default App;
