# Lazy Decipheriv

Problem: In Node, it's required to `decipher.setAuthTag()` _before_ beginning a decipher stream.

`createLazyDecipheriv` is like `createDecipheriv`, but you can check the authTag later.

## Usage

```js
const decipher = createLazyDecipheriv('aes-256-gcm', key, iv);

await stream.pipeline(
  readable,
  decipher,
  writable,
);

decipher.setAuthTag(authTag);
console.log(decipher.isAuthenticated) // => true
```
