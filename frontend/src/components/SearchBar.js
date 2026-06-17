export default function SearchBar({ search, setSearch, statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter, dateFilter, setDateFilter, theme }) {

  const dark = theme === "dark"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const bg = dark ? "#16161f" : "#ffffff"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#6b6b80" : "#888"

  const btnStyle = (active, color) => ({
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
    fontWeight: "500", cursor: "pointer", border: "none",
    background: active ? color : (dark ? "#1e1e2a" : "#e8e8f0"),
    color: active ? "#fff" : subColor,
  })

  return (
    <div style={{ marginBottom: "20px" }}>
      <input placeholder="🔍  Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", background: bg, border: `1px solid ${border}`,
          borderRadius: "10px", padding: "11px 16px", color: textColor,
          fontSize: "14px", marginBottom: "12px", transition: "all 0.2s"
        }} />
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {[["", "All"], ["todo", "📋 Todo"], ["in progress", "🔄 In Progress"], ["done", "✅ Done"]].map(([val, label]) => (
          <button key={val} className="filter-btn" onClick={() => setStatusFilter(val)}
            style={btnStyle(statusFilter === val, "#4f46e5")}>{label}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {[["", "All Priority"], ["low", "🟢 Low"], ["medium", "🟡 Medium"], ["high", "🔴 High"]].map(([val, label]) => (
          <button key={val} className="filter-btn" onClick={() => setPriorityFilter(val)}
            style={btnStyle(priorityFilter === val, "#7c3aed")}>{label}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {[["", "Any Date"], ["today", " Today"], ["week", " This Week"], ["overdue", " Overdue"]].map(([val, label]) => (
          <button key={val} className="filter-btn" onClick={() => setDateFilter(val)}
            style={btnStyle(dateFilter === val, "#ef4444")}>{label}</button>
        ))}
      </div>
    </div>
  )
}