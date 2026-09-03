import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export interface UploadResult {
  success: boolean;
  url: string;
  provider: 'cloudinary' | 'imgbb' | 'local';
  fileName: string;
  folder: string;
  size: number;
}

export class UploadService {
  /**
   * Upload image with Cloudinary -> ImgBB fallback -> Local Server storage fallback.
   * Supports dynamic folder-based organization (e.g. 'homepage', 'guides', 'universities', 'avatars').
   */
  public async uploadImage(
    buffer: Buffer,
    originalFilename: string,
    mimeType: string,
    folder: string = 'general'
  ): Promise<UploadResult> {
    // Sanitize folder path (e.g. 'homepage/advisor', 'guides', 'universities')
    const sanitizedFolder = folder
      ? folder
          .toLowerCase()
          .replace(/[^a-z0-9/_-]/g, '')
          .replace(/^\/+|\/+$/g, '') || 'general'
      : 'general';

    // 1. Try Cloudinary Primary (organizes into Cloudinary folders)
    const cloudinaryUrl = await this.uploadToCloudinary(buffer, originalFilename, sanitizedFolder);
    if (cloudinaryUrl) {
      console.log(`[UploadService] Uploaded to Cloudinary [folder: ${sanitizedFolder}]: ${cloudinaryUrl}`);
      return {
        success: true,
        url: cloudinaryUrl,
        provider: 'cloudinary',
        fileName: originalFilename,
        folder: sanitizedFolder,
        size: buffer.length,
      };
    }

    // 2. Try ImgBB Secondary Fallback
    const imgbbUrl = await this.uploadToImgBB(buffer, sanitizedFolder, originalFilename);
    if (imgbbUrl) {
      console.log(`[UploadService] Uploaded to ImgBB [folder: ${sanitizedFolder}]: ${imgbbUrl}`);
      return {
        success: true,
        url: imgbbUrl,
        provider: 'imgbb',
        fileName: originalFilename,
        folder: sanitizedFolder,
        size: buffer.length,
      };
    }

    // 3. Tertiary Fallback: Local Server Storage with Subdirectories
    const localUrl = await this.saveLocally(buffer, originalFilename, sanitizedFolder);
    console.log(`[UploadService] Saved locally to Express server disk [folder: ${sanitizedFolder}]: ${localUrl}`);
    return {
      success: true,
      url: localUrl,
      provider: 'local',
      fileName: originalFilename,
      folder: sanitizedFolder,
      size: buffer.length,
    };
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    filename: string,
    folder: string
  ): Promise<string | null> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloudName) {
      return null;
    }

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const targetFolder = `eduguide/${folder}`;
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(buffer)]);
      formData.append('file', blob, filename);
      formData.append('folder', targetFolder);

      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      } else if (apiKey && apiSecret) {
        // Cloudinary requires sorted query string for SHA1 signature (folder comes before timestamp alphabetically)
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
      } else {
        const errText = await res.text();
        console.warn('[UploadService] Cloudinary returned error response:', errText);
      }
    } catch (err: any) {
      console.warn('[UploadService] Cloudinary error:', err?.message);
    }

    return null;
  }

  private async uploadToImgBB(
    buffer: Buffer,
    folder: string,
    originalFilename: string
  ): Promise<string | null> {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return null;
    }

    try {
      const base64 = buffer.toString('base64');
      const formData = new FormData();
      formData.append('image', base64);
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
      } else {
        const errText = await res.text();
        console.warn('[UploadService] ImgBB returned error response:', errText);
      }
    } catch (err: any) {
      console.warn('[UploadService] ImgBB error:', err?.message);
    }

    return null;
  }

  private async saveLocally(
    buffer: Buffer,
    originalFilename: string,
    folder: string
  ): Promise<string> {
    const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const unique = `img_${Date.now()}_${sanitizedName}`;

    // Target folder inside uploads directory (e.g. backend/uploads/homepage/advisor)
    const folderParts = folder.split('/').filter(Boolean);
    const uploadDir = path.join(process.cwd(), 'uploads', ...folderParts);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, unique);
    await fs.promises.writeFile(filePath, buffer);

    // Form clean static URL, e.g. /uploads/homepage/advisor/img_123_pic.png
    return `/uploads/${folderParts.join('/')}/${unique}`;
  }
}

export const uploadService = new UploadService();
