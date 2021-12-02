import { Module } from '@nestjs/common';
import { DesService } from './des.service';
import { TripleDesService } from './triple-des.service';

@Module({
  providers: [DesService, TripleDesService],
  exports: [DesService, TripleDesService],
})
export class EncryptionModule {}
