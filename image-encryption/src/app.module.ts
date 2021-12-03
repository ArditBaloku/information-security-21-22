import { Module } from '@nestjs/common';
import { EncryptionModule } from './encryption/encryption.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [EncryptionModule, ImageModule],
})
export class AppModule {}
