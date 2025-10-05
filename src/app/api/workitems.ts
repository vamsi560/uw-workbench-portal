import { NextResponse } from "next/server";
import { workItems } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sinceId = searchParams.get("since_id");

  let items = workItems;
  if (sinceId) {
    // Only return items with id greater than since_id (assuming id is numeric)
    items = items.filter((item) => Number(item.id) > Number(sinceId));
  }
  return NextResponse.json(items.slice(0, limit));
}
