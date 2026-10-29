import { useEffect, useState } from 'react';
import { getJson } from '../../lib/apiClient.js';

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getJson('/api/tasks').then((data) => setTasks(data.tasks));
  }, []);

  function toggleDone(id, done) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    });
  }

  return { tasks, toggleDone };
}
