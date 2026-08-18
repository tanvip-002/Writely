import fs from "fs";
import path from "path";

export interface IStorageService {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  private uploadDir = path.join(process.cwd(), "public", "uploads");

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer, filename: string): Promise<string> {
    const ext = path.extname(filename) || ".png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    await fs.promises.writeFile(filePath, file);
    return `/uploads/${uniqueName}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new LocalStorageService();
