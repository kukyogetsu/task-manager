import { useState } from "react"

const statusColors = { todo: "#4f46e5", "in progress": "#f59e0b", done: "#10b981" }
const priorityColors = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" }

export default function TaskList({ tasks, onDelete, onEdit, theme }) {
  const [removingId, setRemovingId] = useState(null)

  const dark = theme === "dark"
  const bg = dark ? "#16161f" : "#ffffff"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#6b6b80" : "#888"

  const handleDelete = (id) => {
    setRemovingId(id)
    setTimeout(() => onDelete(id), 220)
  }

  if (tasks.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: subColor }}>
      <p style={{ fontSize: "40px", marginBottom: "12px" }}>📭</p>
      <p style={{ fontSize: "16px" }}>No tasks found.</p>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {tasks.map((task, i) => {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done"
        return (
          <div key={task.id}
            className={`task-card ${removingId === task.id ? "removing" : ""}`}
            style={{
              background: bg, border: `1px solid ${border}`,
              borderLeft: `3px solid ${statusColors[task.status] || "#4f46e5"}`,
              borderRadius: "12px", padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              animationDelay: `${i * 0.05}s`
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                <h3 style={{
                  fontSize: "15px", fontWeight: "600",
                  color: task.status === "done" ? subColor : textColor,
                  textDecoration: task.status === "done" ? "line-through" : "none"
                }}>{task.title}</h3>
                <span style={{ background: `${statusColors[task.status]}20`, color: statusColors[task.status], fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: "500" }}>{task.status}</span>
                <span style={{ background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: "500" }}>{task.priority}</span>
              </div>
              {task.description && <p style={{ color: subColor, fontSize: "13px", marginBottom: "6px" }}>{task.description}</p>}
              {task.deadline && <p style={{ color: isOverdue ? "#ef4444" : "#4f46e5", fontSize: "12px" }}>📅 {task.deadline} {isOverdue && "⚠️ Overdue"}</p>}
            </div>
            <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
              <button onClick={() => onEdit(task)} style={{ background: dark ? "#1e1e2a" : "#f0f0f8", border: `1px solid ${border}`, color: subColor, borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>Edit</button>
              <button onClick={() => handleDelete(task.id)} style={{ background: "#ef444415", border: "1px solid #ef444430", color: "#ef4444", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}