const crypto = require('crypto');
const { Transform } = require('stream');

class LazyDecipheriv extends Transform {
  constructor(algorithm, key, iv, options) {
    super();
    this.decipher = crypto.createDecipheriv(algorithm, key, iv, options);
    this._authTagIsSet = false;
    this.isAuthenticated = false;
  }

  _transform(chunk, encoding, callback) {
    this.push(
      this.decipher.update(chunk, encoding)
    );
    callback();
  }

  _flush(callback) {
    if (this._authTagIsSet) {
      this._decipherFinal();
    }
    this.push(null);
    callback();
  }

  setAuthTag(authTag) {
    this.decipher.setAuthTag(authTag);
    this._authTagIsSet = true;
    if (this._readableState.ended) {
      this._decipherFinal();
    }
  }

  _decipherFinal() {
    this.decipher.final();
    this.isAuthenticated = true;
  }
}

function createLazyDecipheriv(algorithm, key, iv, options) {
  return new LazyDecipheriv(algorithm, key, iv, options);
}

module.exports.createLazyDecipheriv = createLazyDecipheriv;
