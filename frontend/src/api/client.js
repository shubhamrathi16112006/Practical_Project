const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const tasksApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tasks${qs ? `?${qs}` : ""}`);
  },
  getOne: (id) => request(`/tasks/${id}`),
  create: (body) => request("/tasks", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};

export const projectsApi = {
  getAll: () => request("/projects"),
  create: (name) => request("/projects", { method: "POST", body: JSON.stringify({ name }) }),
};

export const statsApi = {
  get: () => request("/stats"),
};
