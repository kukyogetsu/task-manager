import { useState, useEffect } from "react"
import api from "../api"

export default function TaskForm({ fetchTasks, editTask, onClose, theme }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState("")

  const dark = theme === "dark"
  const bg = dark ? "#16161f" : "#ffffff"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const inputBg = dark ? "#1e1e2a" : "#f8f8ff"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"

  const inputStyle = {
    width: "100%", background: inputBg, border: `1px solid ${border}`,
    borderRadius: "8px", padding: "10px 14px", color: textColor,
    fontSize: "14px", marginBottom: "12px", transition: "all 0.2s"
  }

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description || "")
      setStatus(editTask.status)
      setPriority(editTask.priority || "medium")
      setDeadline(editTask.deadline || "")
    }
  }, [editTask])

  const handleSubmit = async () => {
    if (!title.trim()) return
    const payload = { title, description, status, priority, deadline: deadline || null }
    if (editTask) {
      await api.put(`/tasks/${editTask.id}`, payload)
    } else {
      await api.post("/tasks", payload)
    }
    fetchTasks()
    onClose()
  }

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: textColor }}>
        {editTask ? "✏️ Edit Task" : "✨ New Task"}
      </h2>
      <input placeholder="Task title *" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
          <option value="todo">📋 Todo</option>
          <option value="in progress">🔄 In Progress</option>
          <option value="done">✅ Done</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>
      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
        style={{ ...inputStyle, colorScheme: dark ? "dark" : "light" }} />
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-primary" onClick={handleSubmit} style={{
          flex: 1, background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#fff", border: "none", borderRadius: "8px",
          padding: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px"
        }}>
          {editTask ? "Update Task" : "Add Task"}
        </button>
        <button onClick={onClose} style={{
          padding: "10px 16px", background: inputBg, color: "#6b6b80",
          border: `1px solid ${border}`, borderRadius: "8px", cursor: "pointer", fontSize: "14px"
        }}>Cancel</button>
      </div>
    </div>
  )
}