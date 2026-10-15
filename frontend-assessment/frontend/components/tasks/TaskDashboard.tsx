"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatus } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskList } from "@/components/tasks/TaskList";
import { useState, useEffect } from "react";

export function TaskDashboard() {
  const {
    filteredTasks,
    filter,
    loading,
    error,
    updatingTaskId,
    setFilter,
    fetchTasks,
    updateTaskStatus,
  } = useTasks();

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    const ok = await updateTaskStatus(task.id, status);
    if (ok) {
      setSuccessMessage(`Task "${task.title}" updated successfully!`);
    }
  };

  return (
    <section className="stack">
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Task Dashboard</h1>
      </header>

      <StatusFilter value={filter} onChange={setFilter} />

      {successMessage ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#a8d5ba", background: "#f0fdf4" }}>
          <p style={{ margin: 0, color: "#166534" }}>✓ {successMessage}</p>
        </section>
      ) : null}

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading tasks...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>{error}</p>
          <button type="button" className="button" onClick={fetchTasks}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error ? (
        <TaskList
          tasks={filteredTasks}
          updatingTaskId={updatingTaskId}
          onStatusChange={handleStatusChange}
        />
      ) : null}
    </section>
  );
}