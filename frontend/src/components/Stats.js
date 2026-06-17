export default function Stats({ tasks, theme }) {
  const dark = theme === "dark"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const bg = dark ? "#16161f" : "#ffffff"
  const subColor = dark ? "#6b6b80" : "#888"

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in progress').length
  const todo = tasks.filter(t => t.status === 'todo').length

  const card = (label, value, color) => (
    <div style={{
      background: bg, border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`, borderRadius: "12px",
      padding: "16px 20px", flex: 1
    }}>
      <p style={{ color: subColor, fontSize: "12px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
      <p style={{ fontSize: "28px", fontWeight: "700", color }}>{value}</p>
    </div>
  )

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
      {card("Total", total, "#6b6b80")}
      {card("Todo", todo, "#4f46e5")}
      {card("In Progress", inProgress, "#f59e0b")}
      {card("Done", done, "#10b981")}
    </div>
  )
}