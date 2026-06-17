import { useState, useEffect } from "react"
import api from "./api"
import Auth from "./components/Auth"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import SearchBar from "./components/SearchBar"
import Stats from "./components/Stats"
import KanbanBoard from "./components/KanbanBoard"
import StatsPage from "./components/StatsPage"
import "./index.css"

function App() {
  const [user, setUser] = useState(localStorage.getItem("username"))
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [editTask, setEditTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState("list") // list | kanban | stats

  const dark = theme === "dark"
  const bg = dark ? "#0f0f13" : "#f4f4f8"
  const headerBg = dark ? "#16161f" : "#ffffff"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#6b6b80" : "#888"

  useEffect(() => {
    document.body.className = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  const fetchTasks = async () => {
    const res = await api.get("/tasks", {
      params: { search, status: statusFilter, priority: priorityFilter, date_filter: dateFilter }
    })
    setTasks(res.data)
  }

  useEffect(() => { if (user) fetchTasks() }, [search, statusFilter, priorityFilter, dateFilter, user])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setUser(null)
  }

  const handleEdit = (task) => { setEditTask(task); setShowForm(true) }
  const handleCloseForm = () => { setEditTask(null); setShowForm(false) }
  const handleDelete = async (id) => { await api.delete(`/tasks/${id}`); fetchTasks() }

  if (!user) return <Auth onLogin={setUser} theme={theme} />

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      {/* Header */}
      <div style={{
        background: headerBg, borderBottom: `1px solid ${border}`,
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: textColor }}>⚡ Task Manager</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* View toggle */}
            <div className="view-toggle">
              {[["list", "☰ List"], ["kanban", "⬛ Kanban"], ["stats", "📊 Stats"]].map(([v, label]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  background: view === v ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "transparent",
                  color: view === v ? "#fff" : subColor,
                  fontWeight: view === v ? "600" : "400"
                }}>{label}</button>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={() => setTheme(dark ? "light" : "dark")} style={{
              background: dark ? "#1e1e2a" : "#e8e8f0", border: `1px solid ${border}`,
              borderRadius: "8px", padding: "6px 12px", cursor: "pointer",
              fontSize: "16px", color: textColor
            }}>
              {dark ? "☀️" : "🌙"}
            </button>

            <span style={{ color: subColor, fontSize: "13px" }}>👤 {user}</span>
            <button onClick={handleLogout} style={{
              background: "#ef444415", border: "1px solid #ef444430",
              color: "#ef4444", borderRadius: "8px", padding: "6px 12px",
              cursor: "pointer", fontSize: "13px"
            }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        {view === "stats" ? (
          <StatsPage theme={theme} />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: textColor }}>
                  {view === "kanban" ? "Kanban Board" : "My Tasks"}
                </h2>
                <p style={{ color: subColor, fontSize: "13px", marginTop: "3px" }}>
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button className="btn-primary" onClick={() => { setEditTask(null); setShowForm(!showForm) }} style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#fff", border: "none", borderRadius: "10px",
                padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>
                {showForm ? "✕ Close" : "+ New Task"}
              </button>
            </div>

            {view === "list" && <Stats tasks={tasks} theme={theme} />}

            {showForm && (
              <div className="form-wrap">
                <TaskForm fetchTasks={fetchTasks} editTask={editTask} onClose={handleCloseForm} theme={theme} />
              </div>
            )}

            {view === "list" && (
              <SearchBar
                search={search} setSearch={setSearch}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                dateFilter={dateFilter} setDateFilter={setDateFilter}
                theme={theme}
              />
            )}

            {view === "list" ? (
              <TaskList tasks={tasks} onDelete={handleDelete} onEdit={handleEdit} theme={theme} />
            ) : (
              <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} onEdit={handleEdit} theme={theme} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App