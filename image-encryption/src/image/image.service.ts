import { Injectable } from '@nestjs/common';
import { DesService } from '../encryption/des.service';

@Injectable()
export class ImageService {
  constructor(private readonly desService: DesService) { }

  load() {
    console.log('Loading image');
  }

  encrypt() {
    console.log('encrypt');
  }

  decrypt() {
    console.log('decrypt');
  }

  write() {
    console.log('write');
  }
}
