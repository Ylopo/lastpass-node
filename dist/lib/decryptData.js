'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

const decrypt = (encrypted, key, iv = false) => {
  const decipher = iv ? (0, _crypto.createDecipheriv)('aes-256-cbc', key, iv) : (0, _crypto.createDecipher)('aes-256-ecb', key);

  decipher.setAutoPadding(false);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

exports['default'] = (data, key) => {
  const length = data.length;

  if (length === 0) return '';

  let decrypted;

  if (data.slice(0, 1).toString('utf8') === '!' && length % 16 === 1 && length > 32) {
    decrypted = decrypt(data.slice(17, length), key, data.slice(1, 17));
  } else {
    decrypted = decrypt(data, key);
  }

  return decrypted;
};