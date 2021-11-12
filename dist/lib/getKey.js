'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _crypto = require('crypto');

var _bluebird = require('bluebird');

var _getIterations = require('./getIterations');

var _getIterations2 = _interopRequireDefault(_getIterations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const pbkdf2Async = (0, _bluebird.promisify)(_crypto.pbkdf2);

exports['default'] = (() => {
  var _ref = (0, _asyncToGenerator3['default'])(function* (username, password) {
    return yield pbkdf2Async(password, username, (yield (0, _getIterations2['default'])(username)), 32, 'sha256');
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();