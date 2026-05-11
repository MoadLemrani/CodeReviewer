const mono = { fontFamily: "'Bekerley Mono', 'Fira Code', monospace" };
const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" };

export default function URLInput({ url, setUrl, context, setContext, onSubmit, loading }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            bordeer: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: 18, marginBottom: 24,
        }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <span style={{
                        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                        color: "#2a3545", fontSize: 13,
                    }}>
                        ⌂
                    </span>
                    <input 
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && onSubmit()}
                        placeholder="https://github.com/owner/repo/pull/123"
                        style={{
                            width: "100%", height: 42,
                            background:"rgba(0,0,0,0.4)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 9, padding: "0 14px 0 36px",
                            color: "#c9d1e0", fontSize: 12, ...mono, outline: "none",
                            transition: "border-color .2s", 
                        }}
                        onFocus={e => (e.target.style.borderColor = "rgba(0,120,255,0.35)")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
                    />
                </div>
                <button
                    onClick={onSubmit}
                    disabled={loading || !url}
                    style={{
                        height: 42, padding: "0 22px",
                        background: loading || !url
                          ? "rgba(255,255,255,0.05)"
                          : "linear-gradient(135deg,#1a7fff,#003dcc)",
                        border: "none", borderRadius: 9,
                        color: loading || !url ? "#2a3545" : "#fff",
                        fontWeight: 600, fontSize: 12, ...sans,
                        letterSpacing: "0.3px",
                        cursor: loading || !url ? "default" : "pointer",
                        transition: "opacity .15s, transform .1s", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => !loading && url && (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    onMouseDown={e => !loading && url && (e.currentTarget.style.transform = "scale(0.97)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {loading ? "analyzing…" : "Review PR →" }
                </button>
            </div>
            <input 
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="optional context — e.g. 'security hardening refactor'"
                style={{
                    width: "100%", height: 32,
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 7, padding: "0 12px",
                    color: "#3d4a5c", fontSize: 11, ...mono, outline: "none",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,120,255,0.2)"; e.currentTarget.style.color = "#3d4a5c"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#3d4a5c"; }}
            />
        </div>
    );
}