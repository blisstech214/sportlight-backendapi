import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

interface IMulterFile {
  fieldname: string;
  originalname: string;
}

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: IMulterFile, cb: (error: Error | null, destination: string) => void) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: IMulterFile, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
});