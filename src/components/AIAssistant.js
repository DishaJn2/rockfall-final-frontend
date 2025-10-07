// src/components/AIAssistant.js
import React, { useState } from "react";

async function fetchAIResponse(query, history) {
  try {
    const res = await fetch("https://rockfall-backend.onrender.com/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, history }),
    });
    const data = await res.json();
    return data.answer;
  } catch (err) {
    console.error("AI error:", err);
    return "⚠ Unable to fetch response. Check backend.";
  }
}

export default function AIAssistant() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I am your Mine Safety Assistant. Ask me about risk, weather, or preventive measures!" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    const response = await fetchAIResponse(query, newMessages);
    setMessages([...newMessages, { sender: "bot", text: response }]);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>🤖 AI Assistant</h2>

      {/* Chat Window */}
      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: 12,
          background: "#fff",
          marginBottom: 12,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 10,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background: msg.sender === "user" ? "#10b981" : "#f3f4f6",
                color: msg.sender === "user" ? "#fff" : "#111827",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ fontSize: 12, color: "#6b7280" }}>Thinking...</div>}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about risk, weather, slope safety..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}