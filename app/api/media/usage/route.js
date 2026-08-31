import { NextResponse } from "next/server";
import { dbFindMediaUsage } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const fileName = searchParams.get('fileName');

    const target = url || fileName;
    if (!target) {
      return NextResponse.json({ inUse: false, count: 0, usages: [] });
    }

    const usageInfo = dbFindMediaUsage(target);
    return NextResponse.json({ success: true, ...usageInfo });
  } catch (error) {
    console.error("GET /api/media/usage error:", error);
    return NextResponse.json({ success: false, inUse: false, error: error.message }, { status: 500 });
  }
}
