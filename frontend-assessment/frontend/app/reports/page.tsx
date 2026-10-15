"use client";

import { useEffect, useState } from "react";

type TasksSummary = {
  total: number;
  byStatus: {
    todo: number;
    "in-progress": number;
    done: number;
  };
  recentActivityCount: number;
};

export default function ReportsPage() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/reports/tasks-summary");

        if (!response.ok) {
          throw new Error("Failed to load reports");
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  const total = summary?.total || 0;
  const todoPercent      = total ? Math.round((summary!.byStatus.todo / total) * 100) : 0;
  const progressPercent  = total ? Math.round((summary!.byStatus["in-progress"] / total) * 100) : 0;
  const donePercent      = total ? Math.round((summary!.byStatus.done / total) * 100) : 0;

  return (
    <main className="stack">

      <div className="card" style={{ padding: "1.5rem" }}>
        <div className="page-header">
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Summary of tasks and recent activity</p>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="spinner" />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading reports…</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger animate-in">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="stat-row animate-in">
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-num clr-primary">{summary.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">To Do</span>
              <span className="stat-num clr-neutral">{summary.byStatus.todo}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">In Progress</span>
              <span className="stat-num clr-warning">{summary.byStatus["in-progress"]}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Done</span>
              <span className="stat-num clr-success">{summary.byStatus.done}</span>
            </div>
          </div>

          <div className="card animate-in" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: "1.25rem" }}>
              Tasks by Status
            </h2>
            <div style={{ display: "grid", gap: "1.1rem" }}>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--todo)", fontWeight: 500 }}>
                    📋 To Do
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--todo)" }}>
                    {summary.byStatus.todo}
                    <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.3rem" }}>
                      ({todoPercent}%)
                    </span>
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${todoPercent}%`, background: "var(--todo)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--in-progress)", fontWeight: 500 }}>
                    ⏳ In Progress
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--in-progress)" }}>
                    {summary.byStatus["in-progress"]}
                    <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.3rem" }}>
                      ({progressPercent}%)
                    </span>
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%`, background: "var(--in-progress)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--done)", fontWeight: 500 }}>
                    ✅ Done
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--done)" }}>
                    {summary.byStatus.done}
                    <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.3rem" }}>
                      ({donePercent}%)
                    </span>
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${donePercent}%`, background: "var(--done)" }} />
                </div>
              </div>

            </div>
          </div>

          <div className="card animate-in" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: "1rem" }}>
              Recent Activity
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                Activity logs in the last 7 days
              </span>
              <span style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--done)", letterSpacing: "-0.04em" }}>
                {summary.recentActivityCount}
              </span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
