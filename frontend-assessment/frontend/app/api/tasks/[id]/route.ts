import { NextResponse } from "next/server";
import { updateTaskInBackend } from "@/lib/backendApi";
import type { TaskStatus } from "@/types/api";

const VALID_STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

type RouteParams = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const payload = (await request.json()) as { status?: TaskStatus };

    if (!payload.status || !VALID_STATUSES.includes(payload.status)) {
      return NextResponse.json(
        { error: { message: `status must be one of: ${VALID_STATUSES.join(", ")}` } },
        { status: 400 }
      );
    }

    const task = await updateTaskInBackend(params.id, payload.status);
    return NextResponse.json({ data: task }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to update task." } },
      { status: 500 }
    );
  }
}