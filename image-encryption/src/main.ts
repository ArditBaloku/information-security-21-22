import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DesService, EncryptionMode } from './encryption/des.service';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import { TripleDesService } from './encryption/triple-des.service';
import { ImageService } from './image/image.service';

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
    .check((argv, options) => {
      if (typeof argv._[1] !== 'string') {
        throw new Error('Invalid path');
      }

      if (path.extname(argv._[1]) !== '.bmp') {
        throw new Error('Sorry, only bmp are supported right now');
      }

      if (argv.a === '3des' && (argv.k as string).length !== 32) {
        throw new Error(
          'Invalid key length. Please provide a 16 byte key in hex characters',
        );
      }

      if (argv.a === 'des' && (argv.k as string).length !== 16) {
        throw new Error(
          'Invalid key length. Please provide an 8 byte key in hex characters',
        );
      }

      return true;
    })
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
  const imagePath = argv._[1] as string;
  const encryptionMode = argv.m as EncryptionMode;
  const key = argv.k as string;

  const encryptionServiceType =
    argv.a === 'des' ? DesService : TripleDesService;
  const encryptionService = app.get(encryptionServiceType);
  const imageService = app.get(ImageService);

  encryptionService.setMode(encryptionMode);

  try {
    if (command === 'encrypt') {
      argv.a === 'des'
        ? await imageService.encrypt(imagePath, key, encryptionMode)
        : await imageService.encryptTripleDes(imagePath, key, encryptionMode);
    } else {
      argv.a === 'des'
        ? await imageService.decrypt(imagePath, key, encryptionMode)
        : await imageService.decryptTripleDes(imagePath, key, encryptionMode);
    }
  } catch (e) {
    console.log('Something went wrong');
  }
}
bootstrap();
