import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Helper to upload to Cloudinary via REST API
async function uploadToCloudinary(buffer: Buffer, filename: string, folder: string): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!cloudName) {
    return null;
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const targetFolder = `eduguide/${folder}`;
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)]);
    formData.append('file', blob, filename);
    formData.append('folder', targetFolder);

    if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
    } else if (apiKey && apiSecret) {
      // Calculate SHA1 signature (folder comes before timestamp alphabetically)
      const crypto = await import('crypto');
      const signatureStr = `folder=${targetFolder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
    } else {
      return null;
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    }
  } catch (err: any) {
    console.warn('[Upload] Cloudinary upload attempt failed:', err?.message);
  }

  return null;
}

// Helper to upload to ImgBB via REST API
async function uploadToImgBB(buffer: Buffer, folder: string, originalFilename: string): Promise<string | null> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const base64Image = buffer.toString('base64');
    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('name', `${folder.replace(/\//g, '_')}_${originalFilename}`);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.url) {
        return data.data.url;
      }
    }
  } catch (err: any) {
    console.warn('[Upload] ImgBB upload attempt failed:', err?.message);
  }

  return null;
}

// Helper to save locally to public/uploads directory
async function saveLocally(buffer: Buffer, originalFilename: string, folder: string): Promise<string> {
  const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueName = `img_${Date.now()}_${sanitizedName}`;
  const folderParts = folder.split('/').filter(Boolean);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', ...folderParts);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${folderParts.join('/')}/${uniqueName}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'general';
    const folder = rawFolder.toLowerCase().replace(/[^a-z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Try forwarding to Express backend first if available
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    try {
      const backendRes = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running, fallback to internal Next.js handlers
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name || 'image.png';

    // 1. Primary: Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, filename, folder);
    if (cloudinaryUrl) {
      return NextResponse.json({
        success: true,
        url: cloudinaryUrl,
        provider: 'cloudinary',
        fileName: filename,
        folder,
        size: buffer.length,
      });
    }

    // 2. Secondary: ImgBB Fallback
    const imgbbUrl = await uploadToImgBB(buffer, folder, filename);
    if (imgbbUrl) {
      return NextResponse.json({
        success: true,
        url: imgbbUrl,
        provider: 'imgbb',
        fileName: filename,
        folder,
        size: buffer.length,
      });
    }

    // 3. Tertiary: Local Static Hosting Fallback
    const localUrl = await saveLocally(buffer, filename, folder);
    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: 'local',
      fileName: filename,
      folder,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('[Upload API] Error processing upload:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
