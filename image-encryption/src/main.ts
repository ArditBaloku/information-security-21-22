import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DesService } from './encryption/des.service';
import * as crypto from 'crypto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const desService = app.get(DesService);
  desService.setMode('cbc');

  const iv = crypto.randomBytes(8).toString('hex');
  const key = crypto.randomBytes(8).toString('hex');

  const encrypted = desService.encrypt('Some random text to encrypt', key, iv);
  console.log(encrypted);
  console.log(desService.decrypt(encrypted, key, iv));

  desService.setMode('ecb');
  const encrypted2 = desService.encrypt('Some random text to encrypt', key);
  console.log(encrypted2);
  console.log(desService.decrypt(encrypted2, key));
}
bootstrap();
