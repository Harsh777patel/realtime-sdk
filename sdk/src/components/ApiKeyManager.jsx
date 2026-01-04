import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApiKeyManager = () => {
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  const saveKey = () => {
    localStorage.setItem("apiKey", key);
    navigate("/chats");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Enter API Key</h2>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter API key"
      />
      <button onClick={saveKey}>Save & Continue</button>
    </div>
  );
};

export default ApiKeyManager;
