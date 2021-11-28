import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

type EncryptionMode = 'ecb' | 'cbc';
@Injectable()
export class DesService {
  private mode: EncryptionMode = 'ecb';

  setMode(mode: EncryptionMode): DesService {
    this.mode = mode;
    return this;
  }

  encrypt(text: string, key: string, iv: string = null): string {
    if (this.mode === 'ecb') return this.encryptEcb(text, key);

    return this.encryptCbc(text, key, iv);
  }

  decrypt(text: string, key: string, iv: string = null): string {
    if (this.mode === 'ecb') return this.decryptEcb(text, key);

    return this.decryptCbc(text, key, iv);
  }

  private encryptEcb(text: string, key: string): string {
    const cipher = crypto.createCipheriv(
      'des-ecb',
      Buffer.from(key, 'hex'),
      null,
    );

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private encryptCbc(text: string, key: string, iv: string): string {
    const cipher = crypto.createCipheriv(
      'des-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex'),
    );

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptCbc(text: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      'des-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex'),
    );

    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }

  private decryptEcb(text: string, key: string): string {
    const decipher = crypto.createDecipheriv(
      'des-ecb',
      Buffer.from(key, 'hex'),
      null,
    );
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
