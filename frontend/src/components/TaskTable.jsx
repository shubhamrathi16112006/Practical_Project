function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name) {
  if (!name || name === "Unassigned") return "—";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function StatusBadge({ status }) {
  const labels = { todo: "Todo", "in-progress": "In Progress", done: "Done" };
  const dots = { todo: "#555", "in-progress": "var(--accent)", done: "#3a3a3a" };
  return (
    <span className={`badge status-${status}`}>
      <span className="badge-dot" style={{ background: dots[status] }} />
      {labels[status] || status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`badge priority-${priority}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export default function TaskTable({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="task-table-wrap">
        <div className="empty-state">
          <div className="empty-icon">◻</div>
          <p className="empty-title">Nothing here yet</p>
          <p className="empty-hint">Create a task using the button above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table-wrap">
      <div className="task-table-header">
        <span className="th">Task</span>
        <span className="th">Status</span>
        <span className="th">Priority</span>
        <span className="th">Assignee</span>
        <span className="th">Due</span>
        <span className="th" />
      </div>

      {tasks.map((task) => (
        <div key={task.id} className={`task-row priority-${task.priority}`}>
          <div className="task-title-cell">
            <p className="task-name">{task.title}</p>
            <p className="task-id">{task.id} · {task.project || "No project"}</p>
          </div>

          <div>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: "inherit",
                color: "inherit",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <PriorityBadge priority={task.priority} />
          </div>

          <div className="assignee-cell">
            <div className="assignee-avatar">{initials(task.assignee)}</div>
            <span>{task.assignee === "Unassigned" ? "—" : task.assignee}</span>
          </div>

          <div className={`due-date ${isOverdue(task.dueDate) && task.status !== "done" ? "overdue" : ""}`}>
            {formatDate(task.dueDate)}
          </div>

          <div className="row-actions">
            <button className="btn-icon" title="Edit" onClick={() => onEdit(task)}>✎</button>
            <button className="btn-icon danger" title="Delete" onClick={() => onDelete(task.id)}>⌫</button>
          </div>
        </div>
      ))}
    </div>
  );
}
