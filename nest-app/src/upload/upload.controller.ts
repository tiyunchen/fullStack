import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { zip } from 'compressing';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Post('album')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any) {
    console.log('file', file);
    return '上传文件';
  }

  // 多个文件上传
  @Post('albums')
  @UseInterceptors(FilesInterceptor('file'))
  uploads(@UploadedFiles() file: any) {
    console.log('file', file);
    return '上传文件';
  }

  // 文件下载 download
  @Get('export')
  export(@Res() res: Response) {
    const url = path.join(__dirname, '../../static/photo2.avif');
    res.download(url);
  }

  // 文件下载 流的方式
  @Post('stream')
  async stream(@Res() res: Response) {
    const url = path.join(__dirname, '../../static/photo2.avif');
    const tarStream = new zip.Stream();
    tarStream.addEntry(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Context-Disposition', 'attachment;filename=cty');
    tarStream.pipe(res);
    tarStream.on('end', function () {
      console.log('文件结束发送');
    });
  }
  // 文件下载 流的方式
  @Post('stream2')
  async stream2(@Res() res: Response) {
    const url = path.join(__dirname, '../../static/photo2.avif');
    const fileStream = fs.createReadStream(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    fileStream.pipe(res);
  }

  @Get('')
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
