'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _decryptData = require('./decryptData');

var _decryptData2 = _interopRequireDefault(_decryptData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

let newBuffer;

const readPayload = () => {
  const size = newBuffer.slice(0, 4).readUInt32BE(0) + 4;
  const content = newBuffer.slice(4, size);

  newBuffer = newBuffer.slice(size, newBuffer.length);

  return content;
};

exports['default'] = (account, key) => {
  newBuffer = account;

  const id = readPayload().toString('utf8');
  const name = (0, _decryptData2['default'])(readPayload(), key).toString('utf8');
  const group = (0, _decryptData2['default'])(readPayload(), key).toString('utf8');
  const url = Buffer.from(readPayload().toString('utf8'), 'hex').toString('utf8');
  const notes = (0, _decryptData2['default'])(readPayload(), key).toString('utf8');

  readPayload();
  readPayload();

  const username = (0, _decryptData2['default'])(readPayload(), key).toString('utf8');
  const password = (0, _decryptData2['default'])(readPayload(), key).toString('utf8');

  readPayload();
  readPayload();

  const secureNote = readPayload().toString('utf8') === '1';

  return {
    id,
    name,
    group,
    url,
    notes,
    username,
    password,
    secureNote
  };
};