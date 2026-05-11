const mono = { fontFamily: "'Berkeley Mono', 'Fira Code', monospace" };

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function DiffLine({ line }) {
  const isRemoved = line.type === "removed";
  const isAdded   = line.type === "added";
  const marker    = isRemoved ? "−" : isAdded ? "+" : "";

  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      background: isRemoved
        ? "rgba(255,60,60,0.06)"
        : isAdded
        ? "rgba(0,220,120,0.05)"
        : "transparent",
      borderLeft: isRemoved
        ? "2px solid rgba(255,60,60,0.3)"
        : isAdded
        ? "2px solid rgba(0,210,110,0.25)"
        : "2px solid transparent",
    }}>
      <span style={{
        width: 34, flexShrink: 0, textAlign: "right",
        padding: "5px 8px 5px 0", fontSize: 10,
        color: "#1a2530", userSelect: "none", ...mono,
      }}>{line.line}</span>
      <span style={{
        width: 16, flexShrink: 0, fontSize: 11,
        padding: "5px 2px", fontWeight: 700, ...mono,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isRemoved ? "rgba(255,70,70,0.6)" : isAdded ? "rgba(0,210,110,0.7)" : "transparent",
      }}>{marker}</span>
      <span
        style={{
          fontSize: 10.5, padding: "5px 16px 5px 4px",
          whiteSpace: "pre", flex: 1, ...mono, lineHeight: 1.6,
          color: isRemoved ? "rgba(255,80,80,0.7)" : isAdded ? "#c9d1e0" : "#2a3545",
        }}
        dangerouslySetInnerHTML={{ __html: escHtml(line.content) }}
      />
    </div>
  );
}

export default function DiffViewer({ diff, language, summary }) {
  const added   = diff.filter(l => l.type === "added").length;
  const removed = diff.filter(l => l.type === "removed").length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: "#2a3545", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          diff
        </span>
        <span style={{
          ...mono, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
          background: "rgba(0,120,255,0.1)", color: "#4d9fff",
          border: "1px solid rgba(0,120,255,0.18)", letterSpacing: "1px",
        }}>{language}</span>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, padding: "8px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, ...mono }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d46e", flexShrink: 0 }} />
          <span style={{ color: "#2a6644" }}>+{added} added</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, ...mono }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c5c", flexShrink: 0 }} />
          <span style={{ color: "#6a2a2a" }}>−{removed} removed</span>
        </span>
      </div>

      {/* Diff lines */}
      <div style={{ overflowX: "auto" }}>
        {diff.map((line, i) => <DiffLine key={i} line={line} />)}
      </div>

      {/* Summary */}
      {summary && (
        <div style={{
          padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(0,0,0,0.25)",
          fontSize: 11, color: "#3d4a5c", lineHeight: 1.6,
        }}>
          {summary}
        </div>
      )}
    </div>
  );
}