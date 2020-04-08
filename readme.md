# Lazy Decipheriv

`crypto.createDecipheriv()`, but `decipher.setAuthTag()` later.

## Problem Solved

In Node, it's required to `decipher.setAuthTag()` _before_ beginning a decipher stream - but that's an arbitrary constraint.

This is wrapper of `crypto.createDecipheriv` which removes that constraint.

## Why

By nature, when using authenticated encryption (such as Galois/Counter Mode), a cipher stream must finish streaming (thereby seeing all data) in order to calculate the authentication tag. A decipher stream does _not_ require an authentication tag to begin streaming. However, in Node, it's required to set the authentication tag for a decipher stream with `decipher.setAuthTag()`, _before_ beginning a decipher stream. 

Where you have **Cipher Stream** --> **Decipher Stream**, requiring that the authentication tag be set on the decipher stream before starting it means you must wait until you are finished ciphering before beginning deciphering. In effect, it's not streaming at all.

Thus, Node's `createDecipheriv` is easy to use (it requires minimal error handling), but highly inefficient when streaming between an encryption to a decryption stream.

Since decipher streams fundamentally do not require an authentication tag to begin streaming, this package removes that constraint, and allows you to set the authentication tag later.

## Usage

```js
const createLazyDecipheriv = require('@transcend-io/lazydecipheriv');
const decipher = createLazyDecipheriv('aes-256-gcm', key, iv);

await pipeline(
  readable,
  decipher,
  writable,
);

decipher.setAuthTag(authTag);
console.log(decipher.isAuthenticated); // => true
```

### Handling invalid authentication tags

An invalid authTag passed to `decipher.setAuthTag()` will throw the same error that `decipher.final()` would. If the authTag is set before the decipher is finished, then the stream will throw when it is done. You can also check `decipher.isAuthenticated` to see if the integrity check has passed yet.

The stream may finish successfully before `authTag` is set, so this library puts the onus on you to handle errors (such as reverting downstream writes) if the `authTag` is incorrect.
