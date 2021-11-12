'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = (endpoint, query = '') => `https://lastpass.com/${endpoint}.php${query}`;