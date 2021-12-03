import { Injectable } from '@nestjs/common';
import { DesService } from '../encryption/des.service';
import * as fs from 'fs';
import { TripleDesService } from 'src/encryption/triple-des.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly desService: DesService,
    private readonly tripleDesService: TripleDesService,
  ) {}

  async load(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async encrypt(path: string, key: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');

    const encryptedImage = this.desService.encrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(encryptedImage, 'hex')]),
      './encrypted-snail.bmp',
    );
  }

  async decrypt(path: string, key: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');

    const decryptedImage = this.desService.decrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(decryptedImage, 'hex')]),
      './decrypted-snail.bmp',
    );
  }

  async encryptTripleDes(path: string, key: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');

    const encryptedImage = this.tripleDesService.encrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(encryptedImage, 'hex')]),
      './encrypted-snail.bmp',
    );
  }

  async decryptTripleDes(path: string, key: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');

    const decryptedImage = this.tripleDesService.decrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(decryptedImage, 'hex')]),
      './decrypted-snail.bmp',
    );
  }

  write(data: Buffer, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) reject();
        resolve();
      });
    });
  }
}
