import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Parse incoming JSON request body
    const data = await request.json();

    // Path to the 'calls' folder in the root directory
    const folderPath = path.join(process.cwd(), 'calls');

    // Generate a file name using the current timestamp
    const fileName = `${Date.now()}.json`;

    // Full path to the file to be created
    const filePath = path.join(folderPath, fileName);

    // Create the 'calls' folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save data to the file as JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Return success response
    return NextResponse.json({ message: 'Call data saved successfully!' }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving call data:', error);

    // Check if the error is due to bad JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON in request body.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Failed to save call data.' }, { status: 500 });
  }
}
