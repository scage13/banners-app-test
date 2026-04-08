import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannerDocument, CreateBannerDto } from '@workspace/shared-types';

@Controller('banners')
export class BannersController {

  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async findAll(): Promise<BannerDocument[]> {
    return await this.bannersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BannerDocument> {
    return await this.bannersService.findOne(id);
  }

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto): Promise<BannerDocument> {
    if (!createBannerDto.image) {
      throw new BadRequestException('Image is required');
    }
    try {
      return await this.bannersService.create(createBannerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('image') base64Image?: string,
  ): Promise<BannerDocument> {
    return await this.bannersService.update(id, title, base64Image);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.bannersService.delete(id);
  }
}
