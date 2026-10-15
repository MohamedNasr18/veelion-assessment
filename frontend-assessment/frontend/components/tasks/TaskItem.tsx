import { memo } from "react";
import type { Task, TaskStatus } from "@/types/api";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusBarClass: Record<TaskStatus, string> = {
  todo:         "status-bar status-bar-todo",
  "in-progress":"status-bar status-bar-progress",
  done:         "status-bar status-bar-done",
};

const badgeClass: Record<TaskStatus, string> = {
  todo:          "badge badge-todo",
  "in-progress": "badge badge-in-progress",
  done:          "badge badge-done",
};

type TaskItemProps = {
  task: Task;
  busy: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

function TaskItemComponent({ task, busy, onStatusChange }: TaskItemProps) {
  return (
    <li className="task-item">
      <div className={statusBarClass[task.status]} />

      <div className="task-item-body">
        <div className="task-top-row">
          <p className="task-name">{task.title}</p>
          <span className={badgeClass[task.status]}>{STATUS_LABELS[task.status]}</span>
        </div>
        <small className="task-updated">
          Updated: {new Date(task.updatedAt).toLocaleString()}
        </small>
      </div>

      <div className="task-side">
        <select
          className="task-dropdown"
          value={task.status}
          disabled={busy}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
          aria-label={`Change status of ${task.title}`}
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        {busy ? <span className="saving-label">Saving…</span> : null}
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemComponent);