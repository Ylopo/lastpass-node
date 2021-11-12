'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

class LastpassError extends _es6Error2['default'] {
  constructor({ title, body } = {}) {
    super(title);
    this.name = 'LastpassError';
    this.title = title;
    this.body = body;
  }
}

exports['default'] = LastpassError;