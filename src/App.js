// App.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { PERSONAS } from "./personas";
import { sendToAI } from "./api";

// ─── Sub-components ───────────────────────────────────────────

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function TypingIndicator({ persona }) {
  return (
    <div className="typing-row">
      <div className={`msg-avatar ${persona.id === 0 ? "anshuman" : persona.id === 1 ? "abhimanyu" : "kshitij"}`}>
        {persona.initials}
      </div>
      <div className="typing-bubble">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="error-banner">
      <span className="error-icon">⚠</span>
      <span>{message}</span>
    </div>
  );
}

function WelcomeScreen({ persona, onChipClick }) {
  const colorClass = persona.id === 0 ? "anshuman" : persona.id === 1 ? "abhimanyu" : "kshitij";
  return (
    <div className="welcome">
      <div className={`welcome-avatar ${colorClass}`}>{persona.initials}</div>
      <h2>Chat with {persona.name}</h2>
      <p>{persona.bio}</p>
      <div className="chips">
        {persona.chips.map((chip, i) => (
          <button
            key={i}
            className={`chip chip-${colorClass}`}
            onClick={() => onChipClick(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ msg, persona }) {
  const colorClass = persona.id === 0 ? "anshuman" : persona.id === 1 ? "abhimanyu" : "kshitij";
  const isUser = msg.role === "user";
  return (
    <div className={`msg-row ${isUser ? "user" : "ai"}`}>
      {isUser ? (
        <div className="msg-avatar user-av">You</div>
      ) : (
        <div className={`msg-avatar ${colorClass}`}>{persona.initials}</div>
      )}
      <div className={`bubble ${isUser ? "user" : "ai"}`}>{msg.content}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  const chatAreaRef = useRef(null);
  const inputRef = useRef(null);

  const persona = PERSONAS[activeIdx];

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  // Focus input when persona switches
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeIdx]);

  const switchPersona = (idx) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setHistory([]);
    setError(null);
    setInput("");
  };

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (trimmed === "" || isTyping) return;

    setInput("");
    setError(null);

    const userMsg = { role: "user", content: trimmed };
    const currentHistory = [...history, userMsg];
    setHistory(currentHistory);

    setIsTyping(true);

    try {
      const reply = await sendToAI(persona.systemPrompt, currentHistory);
      const assistantMsg = { role: "assistant", content: reply };
      setHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setHistory((prev) => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, isTyping, history, persona]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChipClick = (chip) => {
    sendMessage(chip);
  };

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  const colorClass = activeIdx === 0 ? "anshuman" : activeIdx === 1 ? "abhimanyu" : "kshitij";

  return (
    <div className="app">
      {/* ── Header ── */}
      <div className="header">
        <div className="logo-mark">S</div>
        <span className="header-title">Scaler Conversations</span>
        <span className="header-subtitle">Prompt Engineering Assignment</span>
      </div>

      {/* ── Persona Tabs ── */}
      <div className="persona-tabs">
        {PERSONAS.map((p, i) => {
          const tc = i === 0 ? "anshuman" : i === 1 ? "abhimanyu" : "kshitij";
          return (
            <button
              key={p.id}
              className={`persona-tab tab-${tc} ${activeIdx === i ? "active" : ""}`}
              onClick={() => switchPersona(i)}
              aria-label={`Chat with ${p.name}`}
            >
              <div className={`tab-dot ${tc}`}>{p.initials}</div>
              {p.name}
            </button>
          );
        })}
      </div>

      {/* ── Persona Banner ── */}
      <div className="persona-banner" key={activeIdx}>
        <div className={`persona-avatar-lg ${colorClass}`}>{persona.initials}</div>
        <div className="persona-banner-info">
          <div className="persona-banner-name">{persona.name}</div>
          <div className="persona-banner-role">{persona.role}</div>
          <div className="online-badge">
            <div className="online-dot" />
            Online — ready to chat
          </div>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="chat-area" ref={chatAreaRef}>
        {history.length === 0 ? (
          <WelcomeScreen persona={persona} onChipClick={handleChipClick} />
        ) : (
          history.map((msg, i) => (
            <Message key={i} msg={msg} persona={persona} />
          ))
        )}
        {isTyping && <TypingIndicator persona={persona} />}
        {error && <ErrorBanner message={error} />}
      </div>

      {/* ── Input Area ── */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            ref={inputRef}
            className={`input-box focus-${colorClass}`}
            placeholder={`Message ${persona.name.split(" ")[0]}...`}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isTyping}
            aria-label="Chat input"
          />
          <button
            className={`send-btn ${colorClass}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <div className="input-hint">Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}
