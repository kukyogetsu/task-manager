import { useState } from "react"
import api from "../api"

export default function Auth({ onLogin, theme }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const dark = theme === "dark"
  const bg = dark ? "#0f0f13" : "#f4f4f8"
  const panelBg = dark ? "#16161f" : "#ffffff"
  const sideBg = dark ? "#1a1a24" : "#eef0fb"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const inputBg = dark ? "#1e1e2a" : "#f8f8ff"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#8a8a9a" : "#6b6b80"
  const faintColor = dark ? "#55556a" : "#a0a0b8"

  const inputStyle = {
    width: "100%", background: inputBg, border: `1px solid ${border}`,
    borderRadius: "8px", padding: "11px 14px", color: textColor,
    fontSize: "14px", marginBottom: "16px", transition: "all 0.2s"
  }

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return setError("Fill in all fields")
    setLoading(true)
    setError("")
    try {
      const endpoint = isLogin ? "/login" : "/register"
      const res = await api.post(endpoint, { username, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("username", res.data.username)
      onLogin(res.data.username)
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong")
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit() }

  const previewTask = (label, state, badge, badgeColor) => (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      background: panelBg, border: `1px solid ${border}`,
      borderRadius: "10px", padding: "11px 14px"
    }}>
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%",
        border: `1.5px solid ${state === "done" ? "#10b981" : state === "warn" ? "#f59e0b" : border}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {state === "done" && <span style={{ color: "#10b981", fontSize: "11px" }}>✓</span>}
      </div>
      <span style={{
        fontSize: "13px", color: state === "done" ? faintColor : textColor,
        textDecoration: state === "done" ? "line-through" : "none"
      }}>{label}</span>
      {badge && (
        <span style={{
          marginLeft: "auto", fontSize: "11px", padding: "2px 8px",
          borderRadius: "8px", background: `${badgeColor}20`, color: badgeColor
        }}>{badge}</span>
      )}
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh", background: bg, display: "flex",
      alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: "920px", minHeight: "560px",
        borderRadius: "20px", overflow: "hidden", border: `1px solid ${border}`,
        boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)"
      }}>

        {/* Left side - storytelling */}
        <div style={{
          flex: "1.1", background: sideBg, padding: "48px 40px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "220px", height: "220px", borderRadius: "50%",
            background: "rgba(79,70,229,0.15)"
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", left: "-40px",
            width: "180px", height: "180px", borderRadius: "50%",
            background: "rgba(16,185,129,0.12)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px"
              }}>⚡</div>
              <span style={{ fontWeight: "700", fontSize: "17px", color: textColor }}>Task Manager</span>
            </div>

            <h1 style={{
              fontSize: "30px", fontWeight: "700", lineHeight: "1.3",
              color: textColor, margin: "0 0 14px"
            }}>
              Organize your work,<br />one task at a time
            </h1>
            <p style={{
              fontSize: "14px", color: subColor, lineHeight: "1.6", maxWidth: "320px"
            }}>
              Track progress, hit deadlines, and see everything that matters in one clean workspace.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
            {previewTask("Finish backend API", "done")}
            {previewTask("Design kanban board", "warn", "today", "#f59e0b")}
            {previewTask("Write project report", "normal", "high", "#ef4444")}
          </div>
        </div>

        {/* Right side - form */}
        <div style={{
          flex: "1", background: panelBg, padding: "48px 40px",
          display: "flex", flexDirection: "column", justifyContent: "center"
        }}>
          <p style={{ fontSize: "12px", color: faintColor, margin: "0 0 6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {isLogin ? "welcome back" : "get started"}
          </p>
          <h2 style={{ fontSize: "23px", fontWeight: "700", color: textColor, margin: "0 0 6px" }}>
            {isLogin ? "Sign in to Task Manager" : "Create your account"}
          </h2>
          <p style={{ fontSize: "13px", color: subColor, margin: "0 0 28px" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setIsLogin(!isLogin); setError("") }}
              style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "600" }}>
              {isLogin ? "Create one" : "Sign in"}
            </span>
          </p>

          <label style={{ fontSize: "13px", color: subColor, marginBottom: "6px", display: "block" }}>Username</label>
          <input placeholder="your username" value={username}
            onChange={e => setUsername(e.target.value)} onKeyDown={handleKey}
            style={inputStyle} />

          <label style={{ fontSize: "13px", color: subColor, marginBottom: "6px", display: "block" }}>Password</label>
          <input placeholder="••••••••" type="password" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}
            style={inputStyle} />

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{
            width: "100%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#fff", border: "none", borderRadius: "9px", padding: "12px",
            fontWeight: "600", fontSize: "15px", cursor: "pointer", marginBottom: "20px"
          }}>
            {loading ? "..." : isLogin ? "Sign in" : "Create account"}
          </button>


          <div style={{ display: "flex", gap: "20px", justifyContent: "center", fontSize: "12px", color: faintColor }}>
          </div>
        </div>
      </div>
    </div>
  )
}