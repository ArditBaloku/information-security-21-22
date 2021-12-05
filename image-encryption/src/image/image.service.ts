import { Injectable } from '@nestjs/common';
import { DesService } from '../encryption/des.service';
import * as fs from 'fs';
import { TripleDesService } from 'src/encryption/triple-des.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly desService: DesService,
    private readonly tripleDesService: TripleDesService,
  ) { }

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

  async encrypt(path: string, key: string, mode: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');
    const imgName = (path.split('\\').pop().split('/').pop().split('.'))[0];
    const nameAfterEncryption = imgName + '-encrypted-des-' + mode + '.bmp';

    const encryptedImage = this.desService.encrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(encryptedImage, 'hex')]),
      './' + nameAfterEncryption,
    );
  }

  async decrypt(path: string, key: string, mode: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');
    const imgName = (path.split('\\').pop().split('/').pop().split('.'))[0];
    const imageShortName = imgName.substr(0, imgName.indexOf('-'));
    const nameAfterDecryption = imageShortName + '-decrypted-des-' + mode + '.bmp';

    const decryptedImage = this.desService.decrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(decryptedImage, 'hex')]),
      './' + nameAfterDecryption,
    );
  }

  async encryptTripleDes(path: string, key: string, mode: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');
    const imgName = (path.split('\\').pop().split('/').pop().split('.'))[0];
    const nameAfterEncryption = imgName + '-encrypted-3des-' + mode + '.bmp';

    const encryptedImage = this.tripleDesService.encrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(encryptedImage, 'hex')]),
      './' + nameAfterEncryption,
    );
  }

  async decryptTripleDes(path: string, key: string, mode: string) {
    const data = await this.load(path);
    const header = data.subarray(0, 54);
    const tail = data.subarray(54).toString('hex');
    const imgName = (path.split('\\').pop().split('/').pop().split('.'))[0];
    const imageShortName = imgName.substr(0, imgName.indexOf('-'));
    const nameAfterDecryption = imageShortName + '-decrypted-3des-' + mode + '.bmp';

    const decryptedImage = this.tripleDesService.decrypt(tail, key);
    await this.write(
      Buffer.concat([header, Buffer.from(decryptedImage, 'hex')]),
      './' + nameAfterDecryption,
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
