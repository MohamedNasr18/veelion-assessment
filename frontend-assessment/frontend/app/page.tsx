import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 className="page-title">Welcome back 👋</h1>
        <p className="page-subtitle" style={{ marginTop: "0.35rem" }}>
          Pick a module below to get started
        </p>
      </header>

      <div className="module-grid">
        <Link href="/tasks" className="module-card">
          <div className="module-icon module-icon-teal">✓</div>
          <div className="module-name">Task Dashboard</div>
          <div className="module-desc">
            View, filter, and update all your tasks in one place.
          </div>
          <span className="module-arrow">↗</span>
        </Link>

        <Link href="/activity" className="module-card">
          <div className="module-icon module-icon-amber">◉</div>
          <div className="module-name">Activity Feed</div>
          <div className="module-desc">
            Browse and search through recent activity logs.
          </div>
          <span className="module-arrow">↗</span>
        </Link>

        <Link href="/reports" className="module-card">
          <div className="module-icon module-icon-green">▦</div>
          <div className="module-name">Reports</div>
          <div className="module-desc">
            Summary of task statuses and recent activity counts.
          </div>
          <span className="module-arrow">↗</span>
        </Link>
      </div>
    </main>
  );
}
