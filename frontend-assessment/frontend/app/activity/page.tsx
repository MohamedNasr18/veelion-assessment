"use client";

import Link from "next/link";
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
      <nav>
        <Link href="/" className="button">
          Back
        </Link>
      </nav>

      <section className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Activity Feed</h1>

        <div style={{ position: "relative" }}>
          <input
            className="input"
            placeholder="Search activity"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
                color: "var(--muted)",
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      <section className="card" style={{ padding: "1rem" }}>
        <small style={{ color: "var(--muted)" }}>
          Total: {activities.length} | Showing: {filteredActivities.length}
        </small>
      </section>

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading activities...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
        </section>
      ) : null}

      {!loading && !error && filteredActivities.length === 0 && searchQuery ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0, color: "var(--muted)" }}>No activities match your search.</p>
        </section>
      ) : null}

      {!loading && !error && activities.length === 0 ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0, color: "var(--muted)" }}>No activity logs yet.</p>
        </section>
      ) : null}

      {!loading && !error && filteredActivities.length > 0 ? (
        <section className="card" style={{ padding: "1rem" }}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.7rem" }}>
            {filteredActivities.map((item) => (
              <li key={item.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.6rem" }}>
                <div style={{ fontWeight: 600 }}>{item.action || "(no action)"}</div>
                <div>{item.info || "(no info)"}</div>
                <small style={{ color: "var(--muted)" }}>{formatTimestamp(item.when)}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
