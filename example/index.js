const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);

const { createLazyDecipheriv } = require('..');

const key = Buffer.from("abcdefghijklmnopqrstuvwxyz012345");
const iv = Buffer.from("0123456789ab");

async function encrypt() {
  const rs = fs.createReadStream(__dirname + '/test.txt');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ws = fs.createWriteStream(__dirname + '/test.txt.enc');
  await pipeline(
    rs,
    cipher,
    ws,
  );
  return cipher.getAuthTag();
}

async function decrypt(authTag) {
  const rs = fs.createReadStream(__dirname + '/test.txt.enc');
  const decipher = createLazyDecipheriv('aes-256-gcm', key, iv, { authTagLength: 16 });
  const ws = fs.createWriteStream(__dirname + '/test-out.txt');

  await pipeline(
    rs,
    decipher,
    ws,
  );

  decipher.setAuthTag(authTag);
  console.log(decipher.isAuthenticated);
}

(async () => {
  const authTag = await encrypt();
  await decrypt(authTag);
})();
