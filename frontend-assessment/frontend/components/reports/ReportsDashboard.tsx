"use client";

import { useTasksSummary } from "@/hooks/useTasksSummary";

const STATUS_ROWS = [
  { key: "todo", emoji: "📋", label: "To Do", color: "var(--todo)", numClass: "clr-neutral" },
  { key: "in-progress", emoji: "⏳", label: "In Progress", color: "var(--in-progress)", numClass: "clr-warning" },
  { key: "done", emoji: "✅", label: "Done", color: "var(--done)", numClass: "clr-success" },
] as const;

export function ReportsDashboard() {
  const { summary, loading, error, reload } = useTasksSummary();

  const percentOf = (count: number) =>
    summary && summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;

  return (
    <section className="stack">
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
          <button type="button" className="button" onClick={reload} style={{ marginInlineStart: "auto" }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="stat-row animate-in">
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-num clr-primary">{summary.total}</span>
            </div>
            {STATUS_ROWS.map(({ key, label, numClass }) => (
              <div className="stat-card" key={key}>
                <span className="stat-label">{label}</span>
                <span className={`stat-num ${numClass}`}>{summary.byStatus[key]}</span>
              </div>
            ))}
          </div>

          <div className="card animate-in" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: "1.25rem" }}>
              Tasks by Status
            </h2>
            <div style={{ display: "grid", gap: "1.1rem" }}>
              {STATUS_ROWS.map(({ key, emoji, label, color }) => {
                const count = summary.byStatus[key];
                const percent = percentOf(count);

                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.875rem", color, fontWeight: 500 }}>
                        {emoji} {label}
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color }}>
                        {count}
                        <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: "0.3rem" }}>
                          ({percent}%)
                        </span>
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percent}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
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
    </section>
  );
}
