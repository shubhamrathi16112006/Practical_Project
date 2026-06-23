export default function Navbar({ onNewTask, searchQuery, onSearch }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-dot" />
        <span className="brand-name">Taskly</span>
      </div>

      <div className="navbar-center">
        <label className="nav-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <span
              style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "0.75rem" }}
              onClick={() => onSearch("")}
            >
              ✕
            </span>
          )}
        </label>
      </div>

      <div className="navbar-right">
        <button className="btn-nav-action" onClick={onNewTask}>
          <span>+</span> New Task
        </button>
        <div className="avatar">TL</div>
      </div>
    </nav>
  );
}
