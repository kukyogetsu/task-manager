import { useEffect, useState } from "react"
import api from "../api"

export default function StatsPage({ theme }) {
  const [stats, setStats] = useState(null)
  const dark = theme === "dark"
  const bg = dark ? "#16161f" : "#ffffff"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#6b6b80" : "#888"

  useEffect(() => {
    api.get("/stats").then(r => setStats(r.data))
  }, [])

  if (!stats) return <p style={{ color: subColor, textAlign: "center", padding: "40px" }}>Loading...</p>

  const percent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

  const StatCard = ({ label, value, color }) => (
    <div style={{
      background: bg, border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`, borderRadius: "12px",
      padding: "20px", flex: 1
    }}>
      <p style={{ color: subColor, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "32px", fontWeight: "700", color }}>{value}</p>
    </div>
  )

  const Bar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: textColor }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "600", color }}>{value}</span>
      </div>
      <div style={{ background: dark ? "#2a2a3a" : "#e8e8f0", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
        <div style={{
          width: max ? `${(value / max) * 100}%` : "0%",
          background: color, height: "100%", borderRadius: "99px",
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: "700", color: textColor, marginBottom: "24px" }}>
        📊 Statistics
      </h2>

      {/* Main stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard label="Total" value={stats.total} color="#6b6b80" />
        <StatCard label="Done" value={stats.done} color="#10b981" />
        <StatCard label="In Progress" value={stats.in_progress} color="#f59e0b" />
        <StatCard label="Overdue" value={stats.overdue} color="#ef4444" />
      </div>

      {/* Completion */}
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <p style={{ color: textColor, fontWeight: "600" }}>Completion Rate</p>
          <p style={{ color: "#10b981", fontWeight: "700", fontSize: "20px" }}>{percent}%</p>
        </div>
        <div style={{ background: dark ? "#2a2a3a" : "#e8e8f0", borderRadius: "99px", height: "10px", overflow: "hidden" }}>
          <div style={{
            width: `${percent}%`, background: "linear-gradient(90deg, #4f46e5, #10b981)",
            height: "100%", borderRadius: "99px", transition: "width 0.8s ease"
          }} />
        </div>
      </div>

      {/* By priority */}
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "24px" }}>
        <p style={{ color: textColor, fontWeight: "600", marginBottom: "20px" }}>Tasks by Priority</p>
        <Bar label="🔴 High" value={stats.by_priority.high} max={stats.total} color="#ef4444" />
        <Bar label="🟡 Medium" value={stats.by_priority.medium} max={stats.total} color="#f59e0b" />
        <Bar label="🟢 Low" value={stats.by_priority.low} max={stats.total} color="#10b981" />
      </div>
    </div>
  )
}