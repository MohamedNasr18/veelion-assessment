import type { ErrorResponse, TasksSummary } from "@/types/api";

export async function fetchTasksSummary(signal?: AbortSignal): Promise<TasksSummary> {
  const response = await fetch("/api/reports/tasks-summary", {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as ErrorResponse;
      message = body.error?.message || message;
    } catch {
    }
    throw new Error(message);
  }

  return (await response.json()) as TasksSummary;
}
