import { NextResponse } from "next/server";
import { workItems } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sinceId = searchParams.get("since_id");

  let items = [...workItems]; // Create a copy to avoid mutations
  
  if (sinceId) {
    // Only return items with id greater than since_id (convert both to numbers for comparison)
    const sinceIdNum = Number(sinceId);
    items = items.filter((item) => Number(item.id) > sinceIdNum);
    
    // If no new items found, return empty array
    if (items.length === 0) {
      return NextResponse.json([]);
    }
  }
  
  // Sort by id descending to get newest first, then apply limit
  items.sort((a, b) => Number(b.id) - Number(a.id));
  
  return NextResponse.json(items.slice(0, limit));
}
