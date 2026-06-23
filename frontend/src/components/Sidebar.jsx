export default function Sidebar({ view, onView, stats, projects, activeProject, onProject }) {
  const navItems = [
    { id: "all", label: "All Tasks", icon: "▦", count: stats?.total },
    { id: "todo", label: "To Do", icon: "○", count: stats?.todo },
    { id: "in-progress", label: "In Progress", icon: "◑", count: stats?.inProgress },
    { id: "done", label: "Done", icon: "●", count: stats?.done },
  ];

  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-section-label">Views</p>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${view === item.id && !activeProject ? "active" : ""}`}
              onClick={() => { onView(item.id); onProject(null); }}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.count != null && <span className="count">{item.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      {projects.length > 0 && (
        <div>
          <p className="sidebar-section-label">Projects</p>
          <nav className="sidebar-nav">
            {projects.map((p) => (
              <button
                key={p}
                className={`sidebar-link ${activeProject === p ? "active" : ""}`}
                onClick={() => { onProject(p); onView("all"); }}
              >
                <span className="icon" style={{ fontSize: "0.5rem" }}>◆</span>
                {p}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div style={{ marginTop: "auto" }}>
        <div style={{
          padding: "12px",
          background: "var(--bg-card)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Progress
          </p>
          <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "var(--accent)",
                borderRadius: "2px",
                width: stats?.total ? `${Math.round((stats.done / stats.total) * 100)}%` : "0%",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px", fontFamily: "var(--mono)" }}>
            {stats?.total ? `${Math.round((stats.done / stats.total) * 100)}% done` : "No tasks"}
          </p>
        </div>
      </div>
    </aside>
  );
}
