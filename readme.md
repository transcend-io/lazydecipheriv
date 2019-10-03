# Lazy Decipheriv

`createDecipheriv`, but `setAuthTag` later.

Problem: In Node, it's required to `decipher.setAuthTag()` _before_ beginning a decipher stream.

`createLazyDecipheriv` is just like `createDecipheriv`, but you can set the authTag later.

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

### Error handling bad auth tags

An invalid authTag passed to `decipher.setAuthTag()` will throw the same error that `decipher.final()` will. If the authTag is set while the stream is in progress, then the stream will throw when it is done. You can also check `decipher.isAuthenticated` to see if the integrity check has passed yet.
