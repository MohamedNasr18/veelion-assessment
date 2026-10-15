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

      <div className="card" style={{ padding: "1.5rem" }}>
        <div className="page-header">
          <h1 className="page-title">Task Dashboard</h1>
          <p className="page-subtitle">Manage and update your tasks</p>
        </div>
      </div>

      <StatusFilter value={filter} onChange={setFilter} />

      {successMessage && (
        <div className="alert alert-success animate-in">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {loading && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="spinner" />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading tasks…</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="card"
          style={{
            padding: "1.25rem",
            borderColor: "rgba(248,113,113,0.3)",
            background: "var(--danger-dim)",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)", fontSize: "0.9rem" }}>
            {error}
          </p>
          <button type="button" className="button" onClick={fetchTasks}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <TaskList
          tasks={filteredTasks}
          updatingTaskId={updatingTaskId}
          onStatusChange={handleStatusChange}
        />
      )}
    </section>
  );
}