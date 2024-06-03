import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) { }

  private generateShortUrl(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async shortenUrl(originalUrl: string, title: string, user?: User): Promise<string> {
    let shortUrl: string;
    let existingUrl: Url;

    do {
      shortUrl = this.generateShortUrl(6);
      existingUrl = await this.urlRepository.findOneBy({ shortUrl });
    } while (existingUrl);

    const newUrl = this.urlRepository.create({ originalUrl, shortUrl, title, user });
    await this.urlRepository.save(newUrl);
    return shortUrl;
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const url = await this.urlRepository.findOneBy({ shortUrl });
    if (url) {
      return url.originalUrl;
    }
    return null;
  }

  async generateQrCodePng(shortUrl: string): Promise<Buffer> {
    const url = `http://localhost:3000/shorten/${shortUrl}`;
    return QRCode.toBuffer(url);
  }

  async generateQrCodePdf(shortUrl: string): Promise<Buffer> {
    const url = `http://localhost:3000/shorten/${shortUrl}`;
    const qrCodeBuffer = await QRCode.toBuffer(url);

    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      return pdfData;
    });

    doc.image(qrCodeBuffer, {
      fit: [250, 250],
      align: 'center',
      valign: 'center',
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  }

  async getUserUrls(user: User): Promise<Url[]> {
    return this.urlRepository.find({ where: { user } });
  }
}
