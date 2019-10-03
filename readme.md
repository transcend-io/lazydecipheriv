# Lazy Decipheriv

`createDecipheriv`, but `setAuthTag` later.

## Problem Solved

In Node, it's required to `decipher.setAuthTag()` _before_ beginning a decipher stream. 

Where **Stream A** --> **Stream B**, **Stream A** must finish streaming in order to calculate the authTag. Before now, **Stream B** couldn't start streaming until the authTag was received (so in effect, it's not streaming at all).

Thus, Node's `createDecipheriv` is easy to use (virtually zero error handling), but highly inefficient when streaming between an encryption to a decryption stream.

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

The stream may finish successfully before `authTag` is set, so this library puts the onus on you to handle errors (such as reverting downstream writes) if the `authTag` is incorrect.
