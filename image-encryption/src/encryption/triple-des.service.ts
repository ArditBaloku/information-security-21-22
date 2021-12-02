import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EncryptionMode } from './des.service';
import { IEncryptor } from './encryptor.interface';

@Injectable()
export class TripleDesService implements IEncryptor {
  private mode: EncryptionMode = 'ecb';

  setMode(mode: EncryptionMode): TripleDesService {
    this.mode = mode;
    return this;
  }

  encrypt(text: string, key: string): string {
    const iv = this.mode === 'ecb' ? null : crypto.randomBytes(8);
    const cipher = crypto.createCipheriv(
      `des-ede-${this.mode}`,
      Buffer.from(key, 'hex'),
      iv,
    );

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return (iv?.toString('hex') ?? '') + encrypted;
  }

  decrypt(text: string, key: string): string {
    const decipher = crypto.createDecipheriv(
      `des-ede-${this.mode}`,
      Buffer.from(key, 'hex'),
      this.mode === 'ecb' ? null : Buffer.from(text.slice(0, 16), 'hex'),
    );

    let decrypted = decipher.update(
      this.mode === 'ecb' ? text : text.slice(16),
      'hex',
      'utf-8',
    );
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}
