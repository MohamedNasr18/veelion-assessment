import { NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/constants";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/reports/tasks-summary`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to fetch reports." } },
      { status: 500 }
    );
  }
}
