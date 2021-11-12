'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _xml2js = require('xml2js');

var _bluebird = require('bluebird');

var _getIterations = require('./getIterations');

var _getIterations2 = _interopRequireDefault(_getIterations);

var _getHash = require('./getHash');

var _getHash2 = _interopRequireDefault(_getHash);

var _getEndpoint = require('./getEndpoint');

var _getEndpoint2 = _interopRequireDefault(_getEndpoint);

var _lastpassError = require('./lastpassError');

var _lastpassError2 = _interopRequireDefault(_lastpassError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const parseXmlAsync = (0, _bluebird.promisify)(_xml2js.parseString);

exports['default'] = (() => {
  var _ref = (0, _asyncToGenerator3['default'])(function* (username, password, twoFactor) {
    const form = new _formData2['default']();
    form.append('method', 'mobile');
    form.append('web', 1);
    form.append('xml', 1);
    form.append('username', username);
    form.append('hash', (yield (0, _getHash2['default'])(username, password)));
    form.append('iterations', (yield (0, _getIterations2['default'])(username)));
    form.append('imei', 'node.js');
    if (twoFactor) form.append('otp', twoFactor);

    const result = yield (0, _nodeFetch2['default'])((0, _getEndpoint2['default'])('login'), {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const xml = yield result.text();

    const json = yield parseXmlAsync(xml);

    if (!json || !json.ok || !json.ok.$ || !json.ok.$.sessionid) {
      // Bad API Response
      // {
      //   message: 'Google Authenticator authentication required! Upgrade your
      //             browser extension so you can enter it.',
      //   cause: 'googleauthrequired',
      //   allowmultifactortrust: 'true',
      //   tempuid: '22759306',
      //   trustexpired: '0',
      //   trustlabel: '',
      //   hidedisable: 'false',
      // }

      throw new _lastpassError2['default']({
        title: 'Session API response is bad',
        body: json && json.response && json.response.error && json.response.error[0] && json.response.error[0].$ || xml
      });
    }

    return json.ok.$.sessionid;
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();