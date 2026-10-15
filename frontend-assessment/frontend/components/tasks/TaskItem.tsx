import { memo } from "react";
import type { Task, TaskStatus } from "@/types/api";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

type TaskItemProps = {
  task: Task;
  busy: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

function TaskItemComponent({ task, busy, onStatusChange }: TaskItemProps) {
  return (
    <li className="card" style={{ padding: "0.85rem", display: "grid", gap: "0.4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "start" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{task.title}</p>
        <span className="badge">{STATUS_LABELS[task.status]}</span>
      </div>

      <small style={{ color: "var(--muted)" }}>
        Updated: {new Date(task.updatedAt).toLocaleString()}
      </small>

      <div>
        <select
          value={task.status}
          disabled={busy}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
          aria-label={`Change status of ${task.title}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {busy ? <small style={{ marginInlineStart: "0.5rem" }}>Saving...</small> : null}
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemComponent);