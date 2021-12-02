import { Module } from '@nestjs/common';
import { DesService } from 'src/encryption/des.service';
import { ImageService } from './image.service';

@Module({
  imports: [DesService],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule { }
