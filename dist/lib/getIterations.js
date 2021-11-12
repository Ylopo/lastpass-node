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

var _getEndpoint = require('./getEndpoint');

var _getEndpoint2 = _interopRequireDefault(_getEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = (() => {
  var _ref = (0, _asyncToGenerator3['default'])(function* (username) {
    const form = new _formData2['default']();
    form.append('email', username);

    const result = yield (0, _nodeFetch2['default'])((0, _getEndpoint2['default'])('iterations'), {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const text = yield result.text();

    return parseInt(text, 10);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();