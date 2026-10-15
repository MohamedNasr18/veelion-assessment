import type { Task, TaskStatus } from "@/types/api";
import { TaskItem } from "@/components/tasks/TaskItem";

type TaskListProps = {
  tasks: Task[];
  updatingTaskId: string;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export function TaskList({ tasks, updatingTaskId, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No tasks found</div>
          <div className="empty-desc">Try changing the filter above.</div>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Task list">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.6rem" }}>
        {tasks.map((task, idx) => (
          <TaskItem
            key={task.id}
            task={task}
            busy={updatingTaskId === task.id}
            onStatusChange={onStatusChange}
          />
        ))}
      </ul>
    </section>
  );
}