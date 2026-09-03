import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadService } from '../modules/upload/upload.service';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.originalname.endsWith('.svg')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP, SVG) are allowed'));
    }
  },
});

export const uploadRouter = Router();

// Handle upload at /upload or /admin/upload-image
const handleImageUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file provided in form-data ("file" or "image")' });
      return;
    }

    const result = await uploadService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    res.status(200).json(result);
  } catch (err: any) {
    next(err);
  }
};

uploadRouter.post('/upload', upload.single('file'), handleImageUpload);
uploadRouter.post('/admin/upload-image', upload.single('file'), handleImageUpload);
