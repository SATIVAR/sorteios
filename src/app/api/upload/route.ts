import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const fileExtension = file.name.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;
  
  // Define the path to the public directory
  const path = join(process.cwd(), 'public', 'logos', filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    const filePath = `/logos/${filename}`;
    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}
