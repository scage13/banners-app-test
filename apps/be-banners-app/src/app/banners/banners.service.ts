import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BannerDocument, CreateBannerDto } from '@workspace/shared-types';

@Injectable()
export class BannersService {
  private readonly dbPath = path.resolve(process.cwd(), 'apps', 'be-banners-app', 'db', 'db.json');
  private readonly uploadsDir = path.resolve(process.cwd(), 'apps', 'be-banners-app', 'uploads');
  private writePromise: Promise<void> = Promise.resolve();

  private async readDb(): Promise<{ data: BannerDocument[] }> {
    try {
      const fileContent = await fs.readFile(this.dbPath, 'utf-8');

      return JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return this.initializeDb();
      }

      throw error;
    }
  }

  private async initializeDb(): Promise<{ data: BannerDocument[] }> {
    const dbDir = path.dirname(this.dbPath);
    await fs.mkdir(dbDir, { recursive: true });
    const initialData = { data: [] };
    await this.writeDb(initialData);

    return initialData;
  }

  private async writeDb(content: { data: BannerDocument[] }): Promise<void> {
    // Race Condition
    this.writePromise = this.writePromise.then(async () => {
      await fs.writeFile(
        this.dbPath,
        JSON.stringify(content, null, 2),
        'utf-8',
      );
    });

    return this.writePromise;
  }

  private getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:4321';
  }

  private async processImage(base64Image: string): Promise<string> {
    const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const extension = matches[1].toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(`Extension ${extension} is not allowed`);
    }

    const buffer = Buffer.from(matches[2], 'base64');

    if (buffer.length > 50 * 1024 * 1024) {
      throw new BadRequestException('Image size is too large (max 5MB)');
    }

    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }

    const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const filePath = path.join(this.uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    return filename;
  }

  async findAll(): Promise<BannerDocument[]> {
    const db = await this.readDb();

    return db.data.map((banner) => ({
      ...banner,
      image: `${this.getBaseUrl()}/uploads/${banner.image}`,
    }));
  }

  async findOne(id: string): Promise<BannerDocument> {
    const db = await this.readDb();
    const banner = db.data.find((b) => b.id === id);

    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return {
      ...banner,
      image: `${this.getBaseUrl()}/uploads/${banner.image}`,
    };
  }

  async create({ title, image }: CreateBannerDto): Promise<BannerDocument> {
    const db = await this.readDb();
    const filename = await this.processImage(image);
    const newBanner: BannerDocument = {
      id: Date.now().toString(),
      title,
      image: filename, // Зберігаємо тільки назву файлу
    };

    db.data.push(newBanner);
    await this.writeDb(db);

    const baseUrl = this.getBaseUrl();

    return {
      ...newBanner,
      image: `${baseUrl}/uploads/${newBanner.image}`,
    };
  }

  async update(id: string, title?: string, base64Image?: string): Promise<BannerDocument> {
    const db = await this.readDb();
    const index = db.data.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    if (title !== undefined) {
      db.data[index].title = title;
    }

    if (base64Image !== undefined) {
      const oldFilename = db.data[index].image;

      if (oldFilename) {
        const oldPath = path.join(this.uploadsDir, oldFilename);

        try {
          await fs.unlink(oldPath);
        } catch { /* empty */ }
      }

      db.data[index].image = await this.processImage(base64Image);
    }

    await this.writeDb(db);
    const baseUrl = this.getBaseUrl();

    return {
      ...db.data[index],
      image: `${baseUrl}/uploads/${db.data[index].image}`,
    };
  }

  async delete(id: string): Promise<void> {
    const db = await this.readDb();
    const index = db.data.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    const filename = db.data[index].image;

    if (filename) {
      const filePath = path.join(this.uploadsDir, filename);

      try {
        await fs.unlink(filePath);
      } catch { /* empty */ }
    }

    db.data.splice(index, 1);
    await this.writeDb(db);
  }
}
