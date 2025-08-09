import { NextResponse } from 'next/server';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ensureDirSync } from 'fs-extra';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const folder = (data.get('folder') as string) || 'uploads'; // Default to 'uploads'

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const fileExtension = file.name.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;
  
  // Define the path to the public directory
  const uploadDir = join(process.cwd(), 'public', folder);
  const path = join(uploadDir, filename);
  
  try {
    // Ensure the directory exists
    ensureDirSync(uploadDir);

    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    const filePath = `/${folder}/${filename}`;
    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}
