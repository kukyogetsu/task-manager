import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import api from "../api"

const statusColors = { todo: "#4f46e5", "in progress": "#f59e0b", done: "#10b981" }
const priorityColors = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" }

const COLUMNS = [
  { id: "todo", label: "📋 Todo" },
  { id: "in progress", label: "🔄 In Progress" },
  { id: "done", label: "✅ Done" },
]

export default function KanbanBoard({ tasks, fetchTasks, onEdit, theme }) {
  const dark = theme === "dark"
  const colBg = dark ? "#16161f" : "#f0f0f8"
  const cardBg = dark ? "#1e1e2a" : "#ffffff"
  const border = dark ? "#2a2a3a" : "#e0e0f0"
  const textColor = dark ? "#e8e8f0" : "#1a1a2e"
  const subColor = dark ? "#6b6b80" : "#888"

  const onDragEnd = async (result) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    const newStatus = destination.droppableId
    await api.patch(`/tasks/${draggableId}/status`, { status: newStatus })
    fetchTasks()
  }

  const getColumnTasks = (status) => tasks.filter(t => t.status === status)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "12px" }}>
        {COLUMNS.map(col => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-col"
                style={{
                  flex: 1, minWidth: "260px",
                  background: snapshot.isDraggingOver
                    ? (dark ? "#1a1a2e" : "#e8e8ff")
                    : colBg,
                  borderRadius: "14px", padding: "16px",
                  border: `1px solid ${border}`,
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: statusColors[col.id] }}>
                    {col.label}
                  </h3>
                  <span style={{
                    background: `${statusColors[col.id]}20`, color: statusColors[col.id],
                    fontSize: "12px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px"
                  }}>
                    {getColumnTasks(col.id).length}
                  </span>
                </div>

                {getColumnTasks(col.id).map((task, index) => (
                  <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          background: cardBg,
                          border: `1px solid ${border}`,
                          borderLeft: `3px solid ${statusColors[task.status]}`,
                          borderRadius: "10px", padding: "12px",
                          marginBottom: "8px", cursor: "grab",
                          boxShadow: snapshot.isDragging ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
                          transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                          transition: "box-shadow 0.2s",
                          ...provided.draggableProps.style
                        }}
                      >
                        <p style={{ fontSize: "14px", fontWeight: "600", color: textColor, marginBottom: "6px" }}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p style={{ fontSize: "12px", color: subColor, marginBottom: "8px" }}>
                            {task.description}
                          </p>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{
                            background: `${priorityColors[task.priority]}20`,
                            color: priorityColors[task.priority],
                            fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: "500"
                          }}>
                            {task.priority}
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {task.deadline && (
                              <span style={{ fontSize: "11px", color: "#4f46e5" }}>📅 {task.deadline}</span>
                            )}
                            <button onClick={() => onEdit(task)} style={{
                              background: "transparent", border: "none",
                              color: subColor, cursor: "pointer", fontSize: "12px", padding: "0 4px"
                            }}>✏️</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {getColumnTasks(col.id).length === 0 && (
                  <div style={{ textAlign: "center", padding: "24px 0", color: subColor, fontSize: "13px" }}>
                    Drop tasks here
                  </div>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}