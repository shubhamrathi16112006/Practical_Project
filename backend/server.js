const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory database seeded with realistic data
let tasks = [
  {
    id: "t-001",
    title: "Audit authentication flow",
    description: "Review JWT expiry handling and refresh token logic across all endpoints.",
    status: "in-progress",
    priority: "high",
    assignee: "Meera K.",
    project: "Backend",
    createdAt: new Date("2026-06-18").toISOString(),
    dueDate: "2026-06-25",
  },
  {
    id: "t-002",
    title: "Design system token migration",
    description: "Replace hardcoded hex values with CSS variables across 14 components.",
    status: "todo",
    priority: "medium",
    assignee: "Arjun S.",
    project: "Frontend",
    createdAt: new Date("2026-06-19").toISOString(),
    dueDate: "2026-06-28",
  },
  {
    id: "t-003",
    title: "Write onboarding flow tests",
    description: "Cover edge cases for email verification and invite-link flows.",
    status: "done",
    priority: "low",
    assignee: "Priya R.",
    project: "QA",
    createdAt: new Date("2026-06-15").toISOString(),
    dueDate: "2026-06-20",
  },
  {
    id: "t-004",
    title: "Set up error monitoring",
    description: "Integrate Sentry for both client and server with proper source maps.",
    status: "todo",
    priority: "high",
    assignee: "Dev O.",
    project: "DevOps",
    createdAt: new Date("2026-06-20").toISOString(),
    dueDate: "2026-06-30",
  },
  {
    id: "t-005",
    title: "Compress and lazy-load images",
    description: "Run existing assets through squoosh, add loading='lazy' to below-fold images.",
    status: "in-progress",
    priority: "medium",
    assignee: "Arjun S.",
    project: "Frontend",
    createdAt: new Date("2026-06-21").toISOString(),
    dueDate: "2026-06-27",
  },
];

let projects = ["Backend", "Frontend", "QA", "DevOps", "Design", "Docs"];

// ── Routes ─────────────────────────────────────────────────────────────────

// GET all tasks (supports ?status= and ?project= filters)
app.get("/api/tasks", (req, res) => {
  let result = [...tasks];
  if (req.query.status) result = result.filter((t) => t.status === req.query.status);
  if (req.query.project) result = result.filter((t) => t.project === req.query.project);
  res.json({ data: result, total: result.length });
});

// GET single task
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ data: task });
});

// POST create task
app.post("/api/tasks", (req, res) => {
  const { title, description, status, priority, assignee, project, dueDate } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });

  const newTask = {
    id: `t-${uuidv4().slice(0, 6)}`,
    title: title.trim(),
    description: description?.trim() || "",
    status: status || "todo",
    priority: priority || "medium",
    assignee: assignee?.trim() || "Unassigned",
    project: project || "General",
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null,
  };

  tasks.unshift(newTask);
  res.status(201).json({ data: newTask });
});

// PATCH update task
app.patch("/api/tasks/:id", (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });

  const allowed = ["title", "description", "status", "priority", "assignee", "project", "dueDate"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  tasks[idx] = { ...tasks[idx], ...updates };
  res.json({ data: tasks[idx] });
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(idx, 1);
  res.json({ message: "Deleted" });
});

// GET projects list
app.get("/api/projects", (_req, res) => {
  res.json({ data: projects });
});

// POST new project
app.post("/api/projects", (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Project name required" });
  if (projects.includes(name.trim())) return res.status(409).json({ error: "Already exists" });
  projects.push(name.trim());
  res.status(201).json({ data: name.trim() });
});

// GET stats summary
app.get("/api/stats", (_req, res) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;
  res.json({ data: { total, done, inProgress, todo, highPriority } });
});

app.listen(PORT, () => {
  console.log(`Taskly API running on http://localhost:${PORT}`);
});
