import { useState, useEffect } from "react";

const EMPTY = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
  project: "",
  dueDate: "",
};

export default function TaskModal({ task, projects, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        assignee: task.assignee || "",
        project: task.project || "",
        dueDate: task.dueDate || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [task]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{task ? "Edit task" : "New task"}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set("title")}
              autoFocus
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Add context or acceptance criteria..."
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set("status")}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={set("priority")}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Assignee</label>
              <input
                type="text"
                placeholder="Name or initials"
                value={form.assignee}
                onChange={set("assignee")}
              />
            </div>
            <div className="field">
              <label>Project</label>
              <select value={form.project} onChange={set("project")}>
                <option value="">— none —</option>
                {projects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Due date</label>
            <input type="date" value={form.dueDate} onChange={set("dueDate")} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving || !form.title.trim()}
          >
            {saving ? "Saving..." : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}
