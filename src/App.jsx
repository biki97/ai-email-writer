import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    recipient: "",
    purpose: "",
    tone: "professional",
    keyPoints: "",
  });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState("");
  const [btnHover, setBtnHover] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateEmail = async () => {
    if (!form.recipient || !form.purpose) {
      alert("Please fill in recipient and purpose!");
      return;
    }
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: form.recipient,
          purpose: form.purpose,
          tone: form.tone,
          keyPoints: form.keyPoints,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(`Error: ${data?.error || "Unknown error"}`);
        setLoading(false);
        return;
      }
      if (data.result) {
        setOutput(data.result);
      } else {
        setError("No response received. Try again.");
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setOutput("");
    setError("");
    setForm({ recipient: "", purpose: "", tone: "professional", keyPoints: "" });
  };

  return (
    <div style={s.page}>

      {/* Top nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navLogo}>
            <div style={s.logoIcon}>✉</div>
            <span style={s.logoText}>EmailAI</span>
          </div>
          <div style={s.navLinks}>
            <a href="https://biki97.github.io" target="_blank" rel="noreferrer" style={s.navLink}>Portfolio</a>
            <a href="https://github.com/biki97" target="_blank" rel="noreferrer" style={s.navLink}>GitHub</a>
            <a href="https://linkedin.com/in/bikidutta" target="_blank" rel="noreferrer" style={s.navBtn}>LinkedIn ↗</a>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={s.main}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot}></span>
            Powered by Google Gemini AI
          </div>
          <h1 style={s.heroTitle}>Write better emails,<br />in seconds</h1>
          <p style={s.heroSub}>Professional AI-generated emails tailored to your recipient, purpose, and tone.</p>
        </div>

        <div style={s.layout}>
          {/* Form */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Compose</h2>
              {output && (
                <button style={s.clearBtn} onClick={clearAll}>Clear all</button>
              )}
            </div>

            <div style={s.field}>
              <label style={s.label}>Recipient <span style={s.required}>*</span></label>
              <input
                style={s.input}
                name="recipient"
                placeholder="e.g. HR Manager, Client, Professor..."
                value={form.recipient}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = "#4f46e5"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Purpose <span style={s.required}>*</span></label>
              <input
                style={s.input}
                name="purpose"
                placeholder="e.g. Job application, Follow up, Request leave..."
                value={form.purpose}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = "#4f46e5"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>Tone</label>
                <select
                  style={s.select}
                  name="tone"
                  value={form.tone}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = "#4f46e5"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="urgent">Urgent</option>
                  <option value="apologetic">Apologetic</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>
                Key points
                <span style={s.optional}> — optional</span>
              </label>
              <textarea
                style={s.textarea}
                name="keyPoints"
                placeholder="e.g. 5 years experience, available from Monday, reference number 123..."
                value={form.keyPoints}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = "#4f46e5"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <button
              style={loading ? s.btnDisabled : btnHover ? s.btnHover : s.btn}
              onClick={generateEmail}
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? (
                <span style={s.loadingRow}>
                  <span style={s.spinner}></span>
                  Generating...
                </span>
              ) : (
                "Generate email →"
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={s.errorCard}>
              <span style={s.errorIcon}>⚠</span>
              <p style={s.errorText}>{error}</p>
            </div>
          )}

          {/* Output */}
          {output && (
            <div style={s.outputCard}>
              <div style={s.outputHeader}>
                <div style={s.outputTitleRow}>
                  <div style={s.outputDot}></div>
                  <h2 style={s.outputTitle}>Generated email</h2>
                </div>
                <button style={s.copyBtn} onClick={copyToClipboard}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div style={s.outputDivider}></div>
              <pre style={s.output}>{output}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={s.footer}>
          <p style={s.footerText}>
            Built by{" "}
            <a href="https://biki97.github.io" target="_blank" rel="noreferrer" style={s.footerLink}>
              Biki Dutta
            </a>
            {" · "}
            <a href="https://github.com/biki97/ai-email-writer" target="_blank" rel="noreferrer" style={s.footerLink}>
              View source
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#0f172a",
  },

  /* Nav */
  nav: {
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "8px" },
  logoIcon: {
    width: "30px",
    height: "30px",
    background: "#4f46e5",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    color: "#fff",
  },
  logoText: { fontSize: "15px", fontWeight: "600", color: "#0f172a" },
  navLinks: { display: "flex", alignItems: "center", gap: "4px" },
  navLink: {
    fontSize: "13px",
    color: "#64748b",
    textDecoration: "none",
    padding: "6px 10px",
    borderRadius: "6px",
  },
  navBtn: {
    fontSize: "13px",
    color: "#4f46e5",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #e0e7ff",
    background: "#eef2ff",
    fontWeight: "500",
    marginLeft: "4px",
  },

  /* Hero */
  main: { maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" },
  hero: { textAlign: "center", marginBottom: "2.5rem" },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "100px",
    padding: "4px 12px",
    fontSize: "12px",
    color: "#15803d",
    fontWeight: "500",
    marginBottom: "1rem",
  },
  heroBadgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },
  heroTitle: {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: "1.2",
    margin: "0 0 0.75rem",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: "1rem",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.6",
    maxWidth: "440px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  /* Layout */
  layout: { display: "flex", flexDirection: "column", gap: "1rem" },

  /* Form card */
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "1.75rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 },
  clearBtn: {
    fontSize: "12px",
    color: "#94a3b8",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
  },

  field: { marginBottom: "1.25rem" },
  row: { display: "flex", gap: "12px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  required: { color: "#ef4444" },
  optional: { color: "#94a3b8", fontWeight: "400" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "90px",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  btn: {
    width: "100%",
    padding: "11px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.01em",
  },
  btnHover: {
    width: "100%",
    padding: "11px",
    background: "#4338ca",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.01em",
  },
  btnDisabled: {
    width: "100%",
    padding: "11px",
    background: "#a5b4fc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "4px",
  },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },

  /* Error */
  errorCard: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  errorIcon: { color: "#ef4444", fontSize: "15px", marginTop: "1px", flexShrink: 0 },
  errorText: { color: "#b91c1c", fontSize: "13px", margin: 0, lineHeight: "1.5" },

  /* Output */
  outputCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
  },
  outputHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
  },
  outputTitleRow: { display: "flex", alignItems: "center", gap: "8px" },
  outputDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
  },
  outputTitle: { fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 },
  outputDivider: { height: "1px", background: "#f1f5f9" },
  copyBtn: {
    padding: "5px 12px",
    background: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  output: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.75",
    margin: 0,
    fontFamily: "inherit",
    padding: "20px",
  },

  /* Footer */
  footer: { marginTop: "3rem", textAlign: "center" },
  footerText: { fontSize: "13px", color: "#94a3b8", margin: 0 },
  footerLink: { color: "#64748b", textDecoration: "none", fontWeight: "500" },
};
