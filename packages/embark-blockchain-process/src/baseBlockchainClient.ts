import { Callback, Environment } from "embark";
import { BaseBlockchainClientOptions, BlockchainClientDefaults, Config } from "../index";
const semver = require("semver");

const NOT_IMPLEMENTED_EXCEPTION = "This method has not been implemented";

// const defaults = {
//   bin: "", // binary for blockchain client, ie "geth", "parity", "lightchain"
//   devWsApi: [], // WS API methods to support when in development ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal']
//   rpcApi: [], // RPC API methods to support, ie ['eth', 'web3', 'net', 'debug', 'personal'],
//   versionsSupported: "", // mimimum client version supported, ie ">=1.3.0"
//   wsApi: [], // WS API methods to support, ie ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal'],
// };

const VERSION_REGEX = /Version: ([0-9]\.[0-9]\.[0-9]).*?/; // Regex used to parse the version from the version command (returned from determineVersionCommand())

// eslint-disable-next-line no-unused-vars
const NAME = ""; // client name, used in logging and for class checks
// eslint-disable-next-line no-unused-vars
const PRETTY_NAME = ""; // client display name used in Embark log

export class BaseBlockchainClient {
  protected config: Config;
  protected env: Environment;
  protected isDev: boolean;

  public defaults: BlockchainClientDefaults = {
    bin: "", // binary for blockchain client, ie "geth", "parity", "lightchain"
    devWsApi: [], // WS API methods to support when in development ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal']
    networkType: "custom",
    rpcApi: [], // RPC API methods to support, ie ['eth', 'web3', 'net', 'debug', 'personal'],
    versionsSupported: "", // mimimum client version supported, ie ">=1.3.0"
    wsApi: [], // WS API methods to support, ie ['eth', 'web3', 'net', 'debug', 'pubsub', 'personal'],
  };
  public name: string = "baseclient";
  public prettyName: string = "Base blockchain client";
  public versSupported: string = ">=0.0.1"; // mimimum client version supported, ie ">=1.3.0"

  constructor(options: BaseBlockchainClientOptions) {
    this.env = options.env || "development";
    this.isDev = options.isDev || (this.env === "development");

    this.config = options.config as Config;
    this.defaults = options.defaults;
    let defaultWsApi = this.defaults.wsApi;
    if (this.isDev) {
      defaultWsApi = this.defaults.devWsApi;
    }
    if (this.defaults.networkType) {
      this.config.networkType = this.config.networkType || this.defaults.networkType;
    }
    if (this.defaults.networkId) {
      this.config.networkId = this.config.networkId || this.defaults.networkId;
    }
    this.config.rpcApi = this.config.rpcApi || this.defaults.rpcApi;
    this.config.wsApi = this.config.wsApi || defaultWsApi;

    this.name = options.name;
    this.prettyName = options.prettyName;
    this.versSupported = options.versSupported;
  }

  get bin() {
    return this.config.ethereumClientBin || this.defaults.bin;
  }

  //#region Overriden Methods
  public isReady(data: string) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  /**
   * Check if the client needs some sort of 'keep alive' transactions to avoid freezing by inactivity
   * @returns {boolean} if keep alive is needed
   */
  public needKeepAlive() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  public getMiner() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  public getBinaryPath() {
    return this.bin;
  }

  public determineVersionCommand() {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  public parseVersion(rawVersionOutput: string) {
    let parsed = "0.0.0";
    const match = rawVersionOutput.match(VERSION_REGEX);
    if (match) {
      parsed = match[1].trim();
    }
    return parsed;
  }

  public isSupportedVersion(parsedVersion: string) {
    let test;
    try {
      let v = semver(parsedVersion);
      v = `${v.major}.${v.minor}.${v.patch}`;
      test = semver.Range(this.versSupported).test(semver(v));
      if (typeof test !== "boolean") {
        test = undefined;
      }
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      // tslint:disable-next-line: no-unsafe-finally
      return test;
    }
  }

  /**
   * Fired before the main blockchain command is run
   * @param {Callback<null>} callback Callback called after the initChain finishes its routine.
   * @returns {void}
   */
  public initChain(callback: Callback<null>) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  public mainCommand(address: string, done: (bin: string, args: string[]) => void) {
    throw new Error(NOT_IMPLEMENTED_EXCEPTION);
  }

  //#endregion
}
