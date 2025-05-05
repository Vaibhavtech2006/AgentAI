export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to save-call API");
    const { prompt, first_message, number } = await req.json();
    console.log({ prompt, first_message, number });

    const entry = { prompt, first_message, number, timestamp: new Date().toISOString() };
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "calls.json");

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    let entries: any[] = [];
    if (fs.existsSync(filePath)) {
      entries = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
    }

    entries.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving call data:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
