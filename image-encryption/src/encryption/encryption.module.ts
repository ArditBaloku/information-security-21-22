import { Module } from '@nestjs/common';
import { DesService } from './des.service';

@Module({
  providers: [DesService],
  exports: [DesService],
})
export class EncryptionModule {}
