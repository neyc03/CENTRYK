import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'apk', 'centryx-dpc-v2.apk'),
      path.join(process.cwd(), 'apps', 'frontend', 'public', 'apk', 'centryx-dpc-v2.apk'),
      path.join(__dirname, '..', '..', '..', '..', 'public', 'apk', 'centryx-dpc-v2.apk')
    ];

    let foundPath: string | null = null;
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse('Archivo APK no encontrado en el servidor', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="centryx-dpc-v2.apk"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new NextResponse(`Error leyendo APK: ${error.message}`, { status: 500 });
  }
}
