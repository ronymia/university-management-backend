import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// CONFIGURE FILE UPLOADER
const configureFileUpload = (fieldName: string, storageLocation: string) => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(storageLocation)) {
        fs.mkdirSync(storageLocation, { recursive: true });
      }
      cb(null, storageLocation);
    },
    filename: (req, file, cb) => {
      const formattedFilename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, formattedFilename);
    }
  });

  return multer({ storage: fileStorage }).single(fieldName);
};

// Middleware wrapper for dynamic configuration
const uploadFile = (fieldName: string, storageLocation: string) => {
  const upload = configureFileUpload(fieldName, storageLocation);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Construct a relative path and attach to req if needed
      if (req.file) {
        req.fileRelativePath = path.posix.join(
          storageLocation.replace(/^uploads\//, ''),
          req.file.filename
        );
      }

      next();
    });
  };
};

export default uploadFile;

// Optional: Extend Express.Request to include fileRelativePath
declare global {
  namespace Express {
    interface Request {
      fileRelativePath?: string;
    }
  }
}
