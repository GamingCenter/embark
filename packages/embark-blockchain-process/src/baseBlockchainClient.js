const semver = require('semver');

const NOT_IMPLEMENTED_EXCEPTION = "This method has not been implemented";

const DEFAULTS = {
  BIN: "", // binary for blockchain client, ie "geth", "parity", "lightchain"
  VERSIONS_SUPPORTED: "", // mimimum client version supported, ie ">=1.3.0"
  RPC_API: [], // RPC API methods to support, ie ['eth', 'web3', 'net', 'debug', 'personal'],
  WS_API: [], // WS API methods to support, ie ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal'],
  DEV_WS_API: [] // WS API methods to support when in development ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal']
};

const VERSION_REGEX = /Version: ([0-9]\.[0-9]\.[0-9]).*?/; // Regex used to parse the version from the version command (returned from determineVersionCommand())

// eslint-disable-next-line no-unused-vars
const NAME = ""; // client name, used in logging and for class checks
// eslint-disable-next-line no-unused-vars
const PRETTY_NAME = ""; // client display name used in Embark log

export class BaseBlockchainClient {

  static get DEFAULTS() {
    return DEFAULTS;
  }

  constructor(options) {
    this.config = options && options.hasOwnProperty('config') ? options.config : {};
    this.env = options && options.hasOwnProperty('env') ? options.env : 'development';
    this.isDev = options && options.hasOwnProperty('isDev') ? options.isDev : (this.env === 'development');
  }

  get bin() {
    return this.config.ethereumClientBin || DEFAULTS.BIN;
  }

  get name() {
    return NAME;
  }

  get prettyName() {
    return PRETTY_NAME;
  }

  get versSupported() {
    return DEFAULTS.VERSIONS_SUPPORTED;
  }

  //#region Overriden Methods
  isReady(_data) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  /**
   * Check if the client needs some sort of 'keep alive' transactions to avoid freezing by inactivity
   * @returns {boolean} if keep alive is needed
   */
  needKeepAlive() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  getMiner() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  getBinaryPath() {
    return this.bin;
  }

  determineVersionCommand() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  parseVersion(rawVersionOutput) {
    let parsed = "0.0.0";
    const match = rawVersionOutput.match(VERSION_REGEX);
    if (match) {
      parsed = match[1].trim();
    }
    return parsed;
  }

  isSupportedVersion(parsedVersion) {
    let test;
    try {
      let v = semver(parsedVersion);
      v = `${v.major}.${v.minor}.${v.patch}`;
      test = semver.Range(this.versSupported).test(semver(v));
      if (typeof test !== 'boolean') {
        test = undefined;
      }
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return test;
    }
  }

  /**
   * Fired before the main blockchain command is run
   * @param {Function} _callback Callback called after the initChain finishes its routine.
   * @returns {void}
   */
  initChain(_callback) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  mainCommand(_address, _done) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  //#endregion
}
