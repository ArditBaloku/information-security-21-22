import { Module } from '@nestjs/common';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
})
export class AppModule {}
