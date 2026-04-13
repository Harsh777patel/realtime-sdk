"use client";

import { useState } from "react";

const tokenize = (code) => {
  const keywords = ["import", "export", "default", "from", "return", "const", "let", "var", "function", "true", "false", "null"];
  const lines = code.split("\n");

  return lines.map((line, li) => {
    const parts = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      // JSX tag name (component)
      const componentMatch = remaining.match(/^(<\/?)([A-Z][a-zA-Z]*)/);
      if (componentMatch) {
        parts.push(<span key={key++} style={{ color: "#818cf8" }}>{componentMatch[1]}{componentMatch[2]}</span>);
        remaining = remaining.slice(componentMatch[0].length);
        continue;
      }

      // strings
      const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/);
      if (strMatch) {
        parts.push(<span key={key++} style={{ color: "#34d399" }}>{strMatch[0]}</span>);
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // JSX tags <>/ =
      const tagMatch = remaining.match(/^[<>\/={}]/);
      if (tagMatch) {
        parts.push(<span key={key++} style={{ color: "#71717a" }}>{tagMatch[0]}</span>);
        remaining = remaining.slice(1);
        continue;
      }

      // keywords
      const kwMatch = remaining.match(new RegExp(`^(${keywords.join("|")})(?=\\b)`));
      if (kwMatch) {
        parts.push(<span key={key++} style={{ color: "#c084fc" }}>{kwMatch[0]}</span>);
        remaining = remaining.slice(kwMatch[0].length);
        continue;
      }

      // prop names (lowercase before =)
      const propMatch = remaining.match(/^([a-z][a-zA-Z0-9]*)(?==)/);
      if (propMatch) {
        parts.push(<span key={key++} style={{ color: "#7dd3fc" }}>{propMatch[0]}</span>);
        remaining = remaining.slice(propMatch[0].length);
        continue;
      }

      // comments
      const cmtMatch = remaining.match(/^(\/\/.*)/);
      if (cmtMatch) {
        parts.push(<span key={key++} style={{ color: "#52525b", fontStyle: "italic" }}>{cmtMatch[0]}</span>);
        remaining = remaining.slice(cmtMatch[0].length);
        continue;
      }

      // default: one char
      parts.push(<span key={key++} style={{ color: "#a1a1aa" }}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }

    return <div key={li}>{parts}{"\n"}</div>;
  });
};

export default function CodeBlock({ code, language = "tsx", filename }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lineCount = code.split("\n").length;

  return (
    <div style={{
      background: "#0d0d0f",
      border: "1px solid #1c1c1f",
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 8,
      fontFamily: "'DM Mono', 'Fira Code', monospace",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #1c1c1f",
        background: "#111113",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* terminal dots */}
          <div style={{ display: "flex", gap: 5 }}>
            {["#ef4444", "#f59e0b", "#10b981"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          {filename && (
            <span style={{ fontSize: 11, color: "#52525b" }}>{filename}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 10,
            color: "#3f3f46",
            background: "#1c1c1f",
            padding: "2px 7px",
            borderRadius: 4,
            letterSpacing: "0.05em",
          }}>
            {language}
          </span>
          <button
            onClick={copy}
            style={{
              background: copied ? "rgba(99,102,241,0.15)" : "#1c1c1f",
              border: `1px solid ${copied ? "rgba(99,102,241,0.4)" : "#27272a"}`,
              color: copied ? "#818cf8" : "#71717a",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4 8L9.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect x="3.5" y="1" width="6.5" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M1 4v6a1 1 0 0 0 1 1h5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div style={{ display: "flex", overflowX: "auto" }}>
        {/* Line numbers */}
        <div style={{
          padding: "20px 0",
          minWidth: 40,
          background: "#0d0d0f",
          borderRight: "1px solid #1c1c1f",
          userSelect: "none",
          flexShrink: 0,
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              lineHeight: "21px",
              color: "#27272a",
              textAlign: "right",
              padding: "0 12px",
            }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre style={{
          margin: 0,
          padding: "20px 24px",
          fontSize: 13,
          lineHeight: "21px",
          overflowX: "auto",
          flex: 1,
          background: "transparent",
        }}>
          <code style={{ fontFamily: "'DM Mono', monospace" }}>
            {tokenize(code)}
          </code>
        </pre>
      </div>
    </div>
  );
}
