'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _os = require('os');

var _fs = require('fs');

var _bluebird = require('bluebird');

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

var _fuzzaldrin = require('fuzzaldrin');

var _getSession = require('./lib/getSession');

var _getSession2 = _interopRequireDefault(_getSession);

var _getVault = require('./lib/getVault');

var _getVault2 = _interopRequireDefault(_getVault);

var _getKey = require('./lib/getKey');

var _getKey2 = _interopRequireDefault(_getKey);

var _openVault = require('./lib/openVault');

var _openVault2 = _interopRequireDefault(_openVault);

var _lastpassError = require('./lib/lastpassError');

var _lastpassError2 = _interopRequireDefault(_lastpassError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const accessAsync = (0, _bluebird.promisify)(_fs.access);
const readFileAsync = (0, _bluebird.promisify)(_fs.readFile);
const writeFileAsync = (0, _bluebird.promisify)(_fs.writeFile);

const Lastpass = class {
  constructor(username) {
    this.username = username;
  }

  loadVault(username, password, twoFactor) {
    var _this = this;

    return (0, _asyncToGenerator3['default'])(function* () {
      if (_this.vault) throw new _lastpassError2['default']({ title: 'Vault already loaded' });

      const session = yield (0, _getSession2['default'])(username, password, twoFactor);
      _this.vault = yield (0, _getVault2['default'])(session);

      _this.username = username;
    })();
  }

  getVaultFilePath(vaultFile) {
    let vaultFileDefault;
    if (typeof vaultFile === 'undefined') {
      vaultFileDefault = this.loadedVaultFile || (0, _path.resolve)((0, _os.homedir)(), `./.lastpass-vault${this.username ? `-${(0, _sanitizeFilename2['default'])(this.username)}` : ''}`);
    }

    return vaultFileDefault || vaultFile;
  }

  loadVaultFile(vaultFile) {
    var _this2 = this;

    return (0, _asyncToGenerator3['default'])(function* () {
      if (_this2.vault) throw new _lastpassError2['default']({ title: 'Vault already loaded' });

      const filePath = _this2.getVaultFilePath(vaultFile);

      try {
        yield accessAsync(filePath, _fs.R_OK);
      } catch (err) {
        throw new _lastpassError2['default']({
          title: `Vault file could not be accessed ${filePath}`,
          body: err
        });
      }

      try {
        _this2.vault = yield readFileAsync(filePath);
      } catch (err) {
        throw new _lastpassError2['default']({
          title: `Vault file could not be read ${filePath}`,
          body: err
        });
      }

      _this2.loadedVaultFile = vaultFile;
    })();
  }

  saveVaultFile(vaultFile, options = {}) {
    var _this3 = this;

    return (0, _asyncToGenerator3['default'])(function* () {
      if (!_this3.vault) throw new _lastpassError2['default']({ title: 'Vault is not loaded' });

      const filePath = _this3.getVaultFilePath(vaultFile);

      try {
        yield writeFileAsync(filePath, _this3.vault, (0, _extends3['default'])({ encoding: 'binary', mode: 0o400 }, options));
      } catch (err) {
        throw new _lastpassError2['default']({
          title: `Vault could not be saved to file ${filePath}`,
          body: err
        });
      }
    })();
  }

  getVault() {
    if (!this.vault) {
      throw new _lastpassError2['default']({
        title: 'Vault is not loaded'
      });
    }

    return this.vault;
  }

  getAccounts(username, password, search = {}) {
    var _this4 = this;

    return (0, _asyncToGenerator3['default'])(function* () {
      if (!username) throw new _lastpassError2['default']({ title: 'No username!' });
      if (!password) throw new _lastpassError2['default']({ title: 'No password!' });
      if (!_this4.vault) throw new _lastpassError2['default']({ title: 'Vault is not loaded' });

      const key = yield (0, _getKey2['default'])(username, password);
      const accounts = yield (0, _openVault2['default'])(_this4.vault, key);

      if (!search.keyword) return accounts;
      return (0, _fuzzaldrin.filter)(accounts, search.keyword, (0, _extends3['default'])({ key: 'name' }, search.options));
    })();
  }
};

exports['default'] = Lastpass;
