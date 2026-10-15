export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean; 
  createdAt: string;
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  action?: string;
  info?: string;
  when: string;
};

export type TasksResponse = {
  data: Task[];
};

export type TaskResponse = {
  data: Task;
};

export type ActivityResponse = {
  data: ActivityLog[];
};

export type ErrorResponse = {
  error?: {
    message?: string;
  };
};

export type TasksSummary = {
  total: number;
  byStatus: Record<TaskStatus, number>;
};