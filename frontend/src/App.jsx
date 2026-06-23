import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TaskTable from "./components/TaskTable";
import TaskModal from "./components/TaskModal";
import { useToast } from "./components/Toast";
import { useTasks, useStats } from "./hooks/useTasks";
import { projectsApi } from "./api/client";

export default function App() {
  const toast = useToast();
  const [view, setView] = useState("all");
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [projects, setProjects] = useState([]);

  // Build filter for API call
  const apiFilters = useMemo(() => {
    const f = {};
    if (view !== "all") f.status = view;
    if (activeProject) f.project = activeProject;
    return f;
  }, [view, activeProject]);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(apiFilters);
  const { stats, refetch: refetchStats } = useStats();

  useEffect(() => {
    projectsApi.getAll().then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  // Client-side search filter
  const visibleTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignee?.toLowerCase().includes(q) ||
        t.project?.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const handleSave = async (form) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, form);
        toast("Task updated");
      } else {
        await createTask(form);
        toast("Task created");
      }
      refetchStats();
    } catch (e) {
      toast(e.message, "error");
      throw e;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      refetchStats();
      toast("Task deleted");
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      refetchStats();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const openNew = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const pageTitle = () => {
    if (activeProject) return activeProject;
    const map = { all: "All Tasks", todo: "To Do", "in-progress": "In Progress", done: "Done" };
    return map[view] || "Tasks";
  };

  const pageSubtitle = () => {
    const n = visibleTasks.length;
    const s = searchQuery ? ` matching "${searchQuery}"` : "";
    return `${n} task${n !== 1 ? "s" : ""}${s}`;
  };

  return (
    <div className="app-shell">
      <Navbar
        onNewTask={openNew}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <Sidebar
        view={view}
        onView={setView}
        stats={stats}
        projects={projects}
        activeProject={activeProject}
        onProject={setActiveProject}
      />

      <main className="main">
        <div className="page-header">
          <div>
            <h1 className="page-title">{pageTitle()}</h1>
            <p className="page-subtitle">{pageSubtitle()}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: "0.78rem" }}
              onClick={openNew}
            >
              + New task
            </button>
          </div>
        </div>

        {!loading && !error && view === "all" && !activeProject && stats && (
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Total tasks</p>
            </div>
            <div className="stat-card">
              <p className="stat-value accent">{stats.inProgress}</p>
              <p className="stat-label">In progress</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">{stats.done}</p>
              <p className="stat-label">Completed</p>
            </div>
            <div className="stat-card">
              <p className="stat-value danger">{stats.highPriority}</p>
              <p className="stat-label">High priority</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-bar">
            ⚠ Could not reach the API — is the backend running on port 4000?
          </div>
        )}

        {loading ? (
          <div className="task-table-wrap">
            <div className="loading-row">
              <div className="spinner" />
              Loading tasks…
            </div>
          </div>
        ) : (
          <TaskTable
            tasks={visibleTasks}
            onEdit={openEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
