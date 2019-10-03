declare module 'lazydecipheriv' {
  import * as stream from 'stream';
  import {
    CipherCCMTypes,
    BinaryLike,
    CipherCCMOptions,
    DecipherCCM,
    CipherGCMTypes,
    CipherGCMOptions,
    DecipherGCM,
    Decipher,
  } from 'crypto';

  function createLazyDecipheriv(
    algorithm: CipherCCMTypes,
    key: BinaryLike,
    iv: BinaryLike | null,
    options: CipherCCMOptions,
  ): DecipherCCM;
  function createLazyDecipheriv(
    algorithm: CipherGCMTypes,
    key: BinaryLike,
    iv: BinaryLike | null,
    options?: CipherGCMOptions,
  ): DecipherGCM;
  function createLazyDecipheriv(algorithm: string, key: BinaryLike, iv: BinaryLike | null, options?: stream.TransformOptions): Decipher;
  export = createLazyDecipheriv;
}
