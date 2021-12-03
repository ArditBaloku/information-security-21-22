import { Module } from '@nestjs/common';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { ImageService } from './image.service';

@Module({
  imports: [EncryptionModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
