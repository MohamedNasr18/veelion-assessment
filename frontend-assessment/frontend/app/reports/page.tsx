"use client";

import Link from "next/link";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
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

  return (
    <main className="stack">
      <nav>
        <Link href="/" className="button">
          Back
        </Link>
      </nav>

      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Reports</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Summary of tasks and recent activity
        </p>
      </header>

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading reports...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
        </section>
      ) : null}

      {!loading && !error && summary ? (
        <>
          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>
              Tasks Overview
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>Total Tasks:</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
                  {summary.total}
                </span>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>
              Tasks by Status
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "#f9fafb", borderRadius: "4px" }}>
                <span>📋 To Do:</span>
                <span style={{ fontWeight: 600 }}>{summary.byStatus.todo}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "#fef3c7", borderRadius: "4px" }}>
                <span>⏳ In Progress:</span>
                <span style={{ fontWeight: 600 }}>{summary.byStatus["in-progress"]}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "#d1fae5", borderRadius: "4px" }}>
                <span>✅ Done:</span>
                <span style={{ fontWeight: 600 }}>{summary.byStatus.done}</span>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>
              Recent Activity
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Activity logs in the last 7 days:</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#059669" }}>
                {summary.recentActivityCount}
              </span>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
