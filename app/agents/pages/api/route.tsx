import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Save the file inside the 'public' folder or wherever you have access to write files
    const filePath = path.join(process.cwd(), 'public', 'callData.json');

    // Write JSON data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: 'Call data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving call data:', error);
    return NextResponse.json({ error: 'Failed to save call data' }, { status: 500 });
  }
}
