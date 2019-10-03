# Lazy Decipheriv

`createDecipheriv`, but `setAuthTag` later.

**Problem:** In Node, it's required to `decipher.setAuthTag()` _before_ beginning a decipher stream.

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

### Error handling invalid authentications tags

An invalid authTag passed to `decipher.setAuthTag()` will throw the same error that `decipher.final()` would. If the authTag is set before the decipher is finished, then the stream will throw when it is done. You can also check `decipher.isAuthenticated` to see if the integrity check has passed yet.
