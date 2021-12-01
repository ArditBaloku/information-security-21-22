import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DesService, EncryptionMode } from './encryption/des.service';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';

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
    .array('k')
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
  const [key1, key2] = argv.k;

  if (typeof imagePath !== 'string') {
    console.log('Invalid path');
    return;
  }

  if (path.extname(imagePath) !== '.jpg') {
    console.log('Sorry, only jpgs are supported right now');
    return;
  }

  if (argv.a === '3des' && argv.k.length !== 2) {
    console.log('Invalid number of keys');
    return;
  }

  // naive setup, improve with interfaces
  if (argv.a === 'des') {
    const desService = app.get(DesService);
    desService.setMode(encryptionMode);
    const result =
      command === 'encrypt'
        ? desService.encrypt('image here', key1 as string)
        : desService.decrypt('image here', key2 as string);
    console.log(result);
  } else if (argv.a === '3des') {
    // const 3desService = app.get(TripleDesService);
    // const 3desService.setMode(encryptionMode);\
    // const result =
    //   command === 'encrypt'
    //     ? 3desService.encrypt('image here', key1 as string, key2 as string)
    //     : 3desService.decrypt('image here', key1 as string, key2 as string);
    // console.log(result);
  }
}
bootstrap();
