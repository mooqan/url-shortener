import { Controller, Post, Body, Get, Param, Res, NotFoundException, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUrlDto } from './dto/url.dto';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { AuthenticatedRequest } from '../auth/auth.types';

@ApiTags('Shorten')
@Controller('shorten')
export class UrlController {
  constructor(private readonly shortenService: UrlService) { }
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'The URL has been successfully shortened.' })
  @ApiResponse({ status: 400, description: 'Invalid URL.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: AuthenticatedRequest): Promise<{ shortUrl: string }> {
    const user = req.user as User;
    const shortUrl = await this.shortenService.shortenUrl(createUrlDto.originalUrl, createUrlDto.title, user);
    return { shortUrl };
  }

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to the original URL.' })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.shortenService.getOriginalUrl(shortUrl);
    if (originalUrl) {
      return res.redirect(originalUrl);
    } else {
      return res.status(404).send('Not found');
    }
  }

  @ApiOperation({ summary: 'Generate QR code for short URL as PNG' })
  @ApiResponse({
    status: 200,
    description: 'QR code generated successfully.',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  @Get(':shortUrl/qr/png')
  async getQrCodePng(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.shortenService.getOriginalUrl(shortUrl);
    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }
    const qrCodeBuffer = await this.shortenService.generateQrCodePng(shortUrl);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrCodeBuffer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get URLs created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'User URLs retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('user/urls')
  async getUserUrls(@Req() req: AuthenticatedRequest) {
    const user = req.user as User;
    const urls = await this.shortenService.getUserUrls(user);
    return urls;
  }
}
