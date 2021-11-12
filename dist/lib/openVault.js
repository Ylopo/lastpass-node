'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _openAccount = require('./openAccount');

var _openAccount2 = _interopRequireDefault(_openAccount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = (() => {
  var _ref = (0, _asyncToGenerator3['default'])(function* (vault, key) {
    let accounts = [];
    let newBuffer = vault;

    while (newBuffer.length > 0) {
      const id = newBuffer.slice(0, 4).toString('utf8');
      const size = newBuffer.slice(4, 8).readUInt32BE(0) + 8;
      const payload = newBuffer.slice(8, size);

      // I think we need to look at SHAR & PRIK too... What are these?
      // Maybe they are needed in the future or something...
      // https://github.com/detunized/lastpass-ruby/blob/master/lib/lastpass/parser.rb#L65

      if (id === 'ACCT') {
        const account = yield (0, _openAccount2['default'])(payload, key);
        accounts = accounts.concat(account);
      }

      newBuffer = newBuffer.slice(size, newBuffer.length);
    }

    return accounts;
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();