import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DesService, EncryptionMode } from './encryption/des.service';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import { TripleDesService } from './encryption/triple-des.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const argv = yargs(hideBin(process.argv))
    .command('encrypt', 'Encrypt an image')
    .command('decrypt', 'Decrypt an image')
    .alias('m', 'mode')
    .nargs('m', 1)
    .describe('m', 'Pick mode to use')
    .choices('m', ['ecb', 'cbc'])
    .alias('a', 'algorithm')
    .nargs('a', 1)
    .describe('a', 'Algorithm to use')
    .choices('a', ['des', '3des'])
    .alias('k', 'key')
    .nargs('k', 1)
    .describe('k', 'The key to use')
    .demandOption(['m', 'k', 'a'])
    .example(
      'nest start -- encrypt ./photo.jpg --mode ecb --algorithm des -k ffffffffffffffff',
      'Encrypt using ecb des',
    )
    .example(
      'nest start -- decrypt ./photo.jpg -m cbc -a 3des -k 0000000000000000 ffffffffffffffff',
      'Decrypt using cbc 3des',
    )
    .help('h')
    .alias('h', 'help').argv;

  const command = argv._[0];
  const imagePath = argv._[1];
  const encryptionMode = argv.m as EncryptionMode;
  const key = argv.k as string;

  if (typeof imagePath !== 'string') {
    console.log('Invalid path');
    return;
  }

  if (path.extname(imagePath) !== '.jpg') {
    console.log('Sorry, only jpgs are supported right now');
    return;
  }

  if (argv.a === '3des' && key.length !== 32) {
    console.log(
      'Invalid key length. Please provide a 16 byte key in hex characters',
    );
    return;
  }

  if (argv.a === 'des' && key.length !== 16) {
    console.log(
      'Invalid key length. Please provide an 8 byte key in hex characters',
    );
    return;
  }

  // naive setup, improve with interfaces
  if (argv.a === 'des') {
    const desService = app.get(DesService);
    desService.setMode(encryptionMode);
    const result =
      command === 'encrypt'
        ? desService.encrypt(imagePath, key)
        : desService.decrypt(imagePath, key);
    console.log(result);
  } else if (argv.a === '3des') {
    const tripleDesService = app.get(TripleDesService);
    tripleDesService.setMode(encryptionMode);
    const result =
      command === 'encrypt'
        ? tripleDesService.encrypt(imagePath, key)
        : tripleDesService.decrypt(imagePath, key);
    console.log(result);
  }
}
bootstrap();
