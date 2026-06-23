import { useState, useEffect, useCallback } from "react";
import { tasksApi, statsApi } from "../api/client";

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tasksApi.getAll(filters);
      setTasks(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await tasksApi.create(data);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await tasksApi.update(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, refetch: fetchTasks, createTask, updateTask, deleteTask };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await statsApi.get();
      setStats(res.data);
    } catch {
      // silently fail stats
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
