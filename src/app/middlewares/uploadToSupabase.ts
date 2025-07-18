import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client with service role key (⚠️ never expose this to frontend)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Actual middleware
const uploadToSupabase = (bucket: string, folder: string = '') => {
  return [
    upload.single('file'), // ← field name must be `file`

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const ext = path.extname(file.originalname);
        const filename = `${folder}${Date.now()}_${file.originalname}`;

        const { error, data } = await supabase.storage.from(bucket).upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const publicUrl = supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;

        // Attach file URL to req object
        req.fileURL = publicUrl;

        next(); // continue to your controller
      } catch (err) {
        return res.status(500).json({ error: 'Upload failed', details: err });
      }
    }
  ];
};

export default uploadToSupabase;

// Add to Express types
declare global {
  namespace Express {
    interface Request {
      fileURL?: string;
    }
  }
}
