const mono = { fontFamily: "'Berkeley Mono', 'Fira Code', monospace" };

const TABS = [
  { key: "security",    label: "Security",    activeColor: "rgba(255,60,60,0.1)",  textColor: "#ff5c5c",  shadow: "rgba(255,60,60,0.15)" },
  { key: "bugs",        label: "Bugs",        activeColor: "rgba(255,160,0,0.1)",  textColor: "#ffaa33",  shadow: "rgba(255,160,0,0.15)" },
  { key: "style",       label: "Style",       activeColor: "rgba(0,180,255,0.1)",  textColor: "#3db5ff",  shadow: "rgba(0,180,255,0.15)" },
  { key: "suggestions", label: "Tips",        activeColor: "rgba(0,210,110,0.1)",  textColor: "#00d46e",  shadow: "rgba(0,210,110,0.15)" },
];

function SeverityBadge({ severity }) {
  const styles = {
    high:   { background: "rgba(255,60,60,0.15)",  color: "#ff5c5c",  border: "1px solid rgba(255,60,60,0.2)"  },
    medium: { background: "rgba(255,160,0,0.12)",  color: "#ffaa33",  border: "1px solid rgba(255,160,0,0.18)" },
    low:    { background: "rgba(0,180,255,0.1)",   color: "#3db5ff",  border: "1px solid rgba(0,180,255,0.15)" },
  };
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "1.2px",
      padding: "2px 7px", borderRadius: 3, ...mono,
      ...(styles[severity] ?? styles.low),
    }}>
      {severity?.toUpperCase()}
    </span>
  );
}

function FindingCard({ item, type }) {
  const borderColor =
    item.severity === "high"   ? "rgba(255,60,60,0.7)"  :
    item.severity === "medium" ? "rgba(255,160,0,0.7)"  :
    type === "suggestions"     ? "rgba(0,210,110,0.7)"  :
                                 "rgba(0,180,255,0.7)";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 11, padding: "14px 16px", marginBottom: 10,
        borderLeft: `3px solid ${borderColor}`,
        transition: "border-color .15s, background .15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.background  = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
      }}
    >
      {type === "suggestions" ? (
        <div style={{ fontSize: 12.5, color: "#8fa3bf", lineHeight: 1.55 }}>
          <span style={{ color: "#00d46e", marginRight: 6 }}>💡</span>
          {item.description}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "#2a3545", ...mono }}>line {item.line}</span>
            <SeverityBadge severity={item.severity} />
          </div>
          <div style={{ fontSize: 12.5, color: "#8fa3bf", lineHeight: 1.55, marginBottom: item.fix ? 8 : 0 }}>
            {item.description}
          </div>
          {item.fix && (
            <div style={{
              fontSize: 10.5, color: "#1a7fff", ...mono,
              background: "rgba(0,120,255,0.06)",
              border: "1px solid rgba(0,120,255,0.1)",
              borderRadius: 6, padding: "7px 10px", lineHeight: 1.5,
            }}>
              → {item.fix}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CommentCard({ review, activeTab, setActiveTab }) {
  const getItems = (key) => {
    if (key === "suggestions") return review?.suggestion ?? review?.suggestions ?? [];
    return review?.[key] ?? [];
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: "flex", gap: 2,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 11, padding: 3, marginBottom: 14,
      }}>
        {TABS.map(t => {
          const isActive = activeTab === t.key;
          const count    = getItems(t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: "7px 6px", borderRadius: 8,
                border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.6px",
                textTransform: "uppercase", ...mono,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                transition: "all .15s",
                background: isActive ? t.activeColor : "transparent",
                color:      isActive ? t.textColor   : "#2a3545",
                boxShadow:  isActive ? `0 0 0 1px ${t.shadow} inset` : "none",
              }}
            >
              {t.label}
              <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.05)" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Findings */}
      <div>
        {getItems(activeTab).length === 0 ? (
          <div style={{ ...mono, fontSize: 11, color: "#1e2a38", textAlign: "center", padding: "32px 0" }}>
            no findings
          </div>
        ) : (
          getItems(activeTab).map((item, i) => (
            <FindingCard key={i} item={item} type={activeTab} />
          ))
        )}
      </div>
    </div>
  );
}