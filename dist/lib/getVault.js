'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _querystring = require('querystring');

var _htmlToText = require('html-to-text');

var _htmlToText2 = _interopRequireDefault(_htmlToText);

var _getEndpoint = require('./getEndpoint');

var _getEndpoint2 = _interopRequireDefault(_getEndpoint);

var _lastpassError = require('./lastpassError');

var _lastpassError2 = _interopRequireDefault(_lastpassError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const endpoint = (0, _getEndpoint2['default'])('getaccts', `?${(0, _querystring.stringify)({
  mobile: 1,
  hash: '0.0',
  hasplugin: '1.0.0',
  requestsrc: 'cli'
})}`);

exports['default'] = (() => {
  var _ref = (0, _asyncToGenerator3['default'])(function* (session) {
    const result = yield (0, _nodeFetch2['default'])(endpoint, {
      credentials: 'include',
      headers: {
        Cookie: (0, _querystring.stringify)({ PHPSESSID: encodeURIComponent(session) }, ';', '=')
      }
    });

    const body = result.body;

    let vaultBuffer = Buffer.from([]);
    body.on('data', function (buffer) {
      vaultBuffer = Buffer.concat([vaultBuffer, buffer]);
    });

    yield new _promise2['default'](function (resolve) {
      body.on('end', resolve);
    });

    if (!result.ok) {
      throw new _lastpassError2['default']({
        title: 'Could not retrieve Lastpass vault',
        body: _htmlToText2['default'].fromString(vaultBuffer.toString('utf8'), { wordwrap: 130 })
      });
    }

    return vaultBuffer;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();