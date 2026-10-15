"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

function filterActivities(items: ActivityLog[], searchText: string) {
  if (!searchText) {
    return items;
  }

  const lowerSearch = searchText.toLowerCase();
  return items.filter(
    (item) =>
      (item.action || "").toLowerCase().includes(lowerSearch) ||
      (item.info || "").toLowerCase().includes(lowerSearch)
  );
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/activity");

        if (!response.ok) {
          throw new Error("Failed to load activities");
        }

        const result = await response.json();
        setActivities(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return filterActivities(activities, searchQuery);
  }, [activities, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="stack">

      <div className="card" style={{ padding: "1.5rem" }}>
        <div className="page-header" style={{ marginBottom: "1.1rem" }}>
          <h1 className="page-title">Activity Feed</h1>
          <p className="page-subtitle">Browse and search recent activity logs</p>
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              pointerEvents: "none",
              fontSize: "0.9rem",
            }}
          >
            🔍
          </span>
          <input
            className="input"
            placeholder="Search by action or info…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.3rem" }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: "absolute",
                right: "0.6rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: "pointer",
                padding: "0.15rem 0.4rem",
                color: "var(--muted)",
                fontSize: "0.72rem",
                lineHeight: 1,
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {!loading && !error && (
          <div style={{ marginTop: "0.85rem", display: "flex", gap: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Total:{" "}
              <strong style={{ color: "var(--text-soft)" }}>{activities.length}</strong>
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Showing:{" "}
              <strong style={{ color: "var(--primary)" }}>{filteredActivities.length}</strong>
            </span>
          </div>
        )}
      </div>

      {loading && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="spinner" />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Loading activities…
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger animate-in">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredActivities.length === 0 && searchQuery && (
        <div className="card animate-in">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No matching activities</div>
            <div className="empty-desc">Try a different search term.</div>
          </div>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No activity yet</div>
            <div className="empty-desc">Activity logs will appear here once available.</div>
          </div>
        </div>
      )}

      {!loading && !error && filteredActivities.length > 0 && (
        <div className="card" style={{ padding: "0 1.25rem" }}>
          <ul className="activity-list">
            {filteredActivities.map((item, idx) => (
              <li
                key={item.id}
                className="activity-item"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="activity-dot" />
                <div className="activity-content">
                  <div className="activity-action">{item.action || "(no action)"}</div>
                  <div className="activity-info">{item.info || "(no info)"}</div>
                  <div className="activity-when">{formatTimestamp(item.when)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
