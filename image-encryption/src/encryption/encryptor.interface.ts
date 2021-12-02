import { EncryptionMode } from './des.service';

export interface IEncryptor {
  setMode(mode: EncryptionMode): IEncryptor;
  encrypt(text: string, key: string): string;
  decrypt(text: string, key: string): string;
}
