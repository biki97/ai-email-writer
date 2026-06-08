import { useState } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

    const prompt = `Write a ${form.tone} email to ${form.recipient}.
Purpose: ${form.purpose}
Key points to include: ${form.keyPoints || "None"}
Write only the email content with Subject line. Keep it concise and effective.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(`API Error: ${data?.error?.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setOutput(text);
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>✉️ AI Email Writer</h1>
          <p style={styles.subtitle}>Generate professional emails in seconds</p>
          <div style={styles.authorTag}>
            Built by{" "}
            <a
              href="https://biki97.github.io"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.authorLink}
            >
              Biki Dutta
            </a>
          </div>
        </div>

        {/* Form */}
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Who are you writing to?</label>
            <input
              style={styles.input}
              name="recipient"
              placeholder="e.g. HR Manager, Client, Professor..."
              value={form.recipient}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>What is the purpose?</label>
            <input
              style={styles.input}
              name="purpose"
              placeholder="e.g. Job application, Follow up, Request leave..."
              value={form.purpose}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tone</label>
            <select
              style={styles.input}
              name="tone"
              value={form.tone}
              onChange={handleChange}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="urgent">Urgent</option>
              <option value="apologetic">Apologetic</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Key points to include (optional)</label>
            <textarea
              style={styles.textarea}
              name="keyPoints"
              placeholder="e.g. 5 years experience, available from Monday, reference number 123..."
              value={form.keyPoints}
              onChange={handleChange}
            />
          </div>

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={generateEmail}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Email ✨"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorCard}>
            <p style={styles.errorText}>❌ {error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div style={styles.card}>
            <div style={styles.outputHeader}>
              <h3 style={styles.outputTitle}>Generated Email</h3>
              <button style={styles.copyBtn} onClick={copyToClipboard}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <pre style={styles.output}>{output}</pre>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footerWrap}>
          <p style={styles.footer}>Powered by Google Gemini AI</p>
          <p style={styles.footerAuthor}>
            © 2026 AI Email Writer · Built by{" "}
            <a
              href="https://biki97.github.io"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Biki Dutta
            </a>
            {" · "}
            <a
              href="https://linkedin.com/in/bikidutta"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              LinkedIn
            </a>
            {" · "}
            <a
              href="https://github.com/biki97"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              GitHub
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { width: "100%", maxWidth: "680px" },
  header: { textAlign: "center", marginBottom: "1.5rem" },
  title: { fontSize: "2rem", fontWeight: "700", color: "#fff", margin: "0 0 0.4rem 0" },
  subtitle: { color: "rgba(255,255,255,0.85)", fontSize: "1rem", margin: "0 0 0.75rem 0" },
  authorTag: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "100px",
    padding: "0.3rem 1rem",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.9)",
  },
  authorLink: {
    color: "#fde68a",
    fontWeight: "600",
    textDecoration: "none",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "1.25rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },
  field: { marginBottom: "1.25rem" },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.4rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.95rem",
    color: "#111",
    background: "#f9fafb",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.95rem",
    color: "#111",
    background: "#f9fafb",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "0.9rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnDisabled: {
    width: "100%",
    padding: "0.9rem",
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  outputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  outputTitle: { margin: 0, fontSize: "1rem", fontWeight: "600", color: "#374151" },
  copyBtn: {
    padding: "0.4rem 1rem",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  output: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "0.92rem",
    color: "#374151",
    lineHeight: "1.7",
    margin: 0,
    fontFamily: "inherit",
  },
  errorCard: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  errorText: { color: "#dc2626", fontSize: "0.9rem", margin: 0 },
  footerWrap: { textAlign: "center", paddingBottom: "1rem" },
  footer: { color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", margin: "0 0 0.3rem 0" },
  footerAuthor: { color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", margin: 0 },
  footerLink: { color: "#fde68a", textDecoration: "none", fontWeight: "600" },
};