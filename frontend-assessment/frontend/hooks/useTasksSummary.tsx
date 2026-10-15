"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTasksSummary } from "@/services/reportsService";
import type { TasksSummary } from "@/types/api";

export function useTasksSummary() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");
      setSummary(await fetchTasksSummary(signal));
    } catch (err) {
      if (signal?.aborted) return;
      setSummary(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { summary, loading, error, reload: () => load() };
}