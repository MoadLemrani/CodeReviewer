import { useState } from 'react';
import URLInput from "./components/URLInput";
import DiffViewer from "./components/DiffViewer";
import CommentCard from "./components/CommentCard";
import { submitReview } from "./api";

const mono = { fontFamily: "'Berkeley Mono', 'Fira Code', monospace" };
const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" };

const Loading_STEPS = ["fetching diff", "detecting language", "running analysis", "building report"];

function parseDiff(rawDiff) {
  if (!rawDiff) return [];

  return rawDiff.split("\n").map((line, i) => ({
    line: i + 1,
    type: line.startsWith("+") && !line.startsWith("+++")
      ? "added"
      : line.startsWith("-") && !line.startsWith("---")
      ? "removed"
      : "neutral",
    content: line.slice(1),
  }));
}

export default function App() {
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("security");

  const handleSubmit = async () => {
    if(!url) return;
    setLoading(true);
    setError(null);
    setReview(null);
    setLoadingStep(0);

    let step = 0;
    const iv = setInterval(() => {
      if (step < Loading_STEPS.length - 1) { step++; setLoadingStep(step); }
    }, 800);

    try {
      const data = await submitReview(url, context);
      clearInterval(iv);
      setReview(data);
      setActiveTab("security");
    } catch(err) {
      clearInterval(iv);
      setError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const diffLines = review ? parseDiff(review.diff) : [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080B10",
      ...sans, color: "#c9d1e0",
      padding: "32px 28px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* bg glow */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointEvents: "none", 
        zIndex: 0,
        background: 
          "radial-gradient(ellipse 60% 40% at 80% 0%, rgba(0,180,255,0.07) 0%, transparent 60%)," 
          + 
          "radial-gradient(ellipse 50% 50% at 10% 90%, rgba(80,50,255,0.05) 0%, transparent 60%)",
      }} />
      
      {/* Grid */}
      <div style={{
        position: "fixed", 
        inset:0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),"
          +
          "linear-gradient(90deg,rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1020,
        margin: "0 auto"
      }}>

        {/* Header */}
        <div style={{ 
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 32
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #1a7fff, #0040cc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "#fff", flexShrink: 0,
            boxShadow: "0 0 20px rgba(0,120,255,0.25)",
          }}>
            ⌥
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#e8edf5", letterSpacing: "-0.2px"}}>CodeReviewer</span>
          <span style={{
            ...mono, fontSize: 9, fontWeight: 700, letterSpacing: "2px",
            padding: "2px 7px", borderRadius: 4,
            background: "rgba(0,120,255,0.2)",
            border: "1px solid rgba(0,120,255,0.2)",
          }}>
            AI
          </span>
          {review && (
            <span style={{ ...mono, marginLeft: "auto", fontSize: 11, color: "#2a3545" }}>
              id: <span style={{ color: "#4d9fff66" }}>{review.id?.slice(0, 8)}…</span>
            </span>
          )}
        </div>

        {/* Input */}
        <URLInput
          url={url} setUrl={setUrl}
          context={context} setContext={setContext}
          onSubmit={handleSubmit}
          loading={loading}
        />

        { /* Error */}
        {error && (
          <div style={{
            background: "rgba(255,60,60,0.08)",
            border: "1px solid rgba(255,60,60,0.2)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            color: "#ff5c5c", fontsize: 12, ...mono,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loding && (
          <div style={{ textAlign: "center", padding: "48px 0"}}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1.5px solid #1a2030", borderTopColor: "#1a7fff",
              animation: "spin .75s linear infinite",
              margin: "0 auto 14px",
            }} />
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
            `}</style>
            <div style={{ ...mono, fontSize: 11, color: "#2a3545", letterSpacing: "0.5px" }}>
              {LOADING_STEPS[loadingStep]}
              <span>
                {[0,1,2].map(i => (
                  <span key={i} style={{ animation: `blink 1.4s ${i * 0.2}s infinite both` }}>.</span>
                ))}
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {review && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <DiffViewer
              diff={diffLines}
              language={review.language}
              summary={review.results?.summary}
            />
            <CommentCard
              review={review.result}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

      </div>
    </div>
  );
}