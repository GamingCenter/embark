import { BaseBlockchainClient } from './src/baseBlockchainClient';
import { Environment } from "embark";

declare module "embark-blockchain-process" {

  export interface NodeAccountSetting {
    numAccounts: Number;
    password: String;
    balance: String;
  }
  export interface Config {
    silent: boolean;
    client: string;
    ethereumClientBin: string;
    networkType: string;
    networkId: number;
    genesisBlock: string | boolean;
    datadir: string;
    mineWhenNeeded: boolean;
    rpcHost: string;
    rpcPort: number;
    rpcCorsDomain: string;
    rpcApi: Array<String>;
    port: number;
    nodiscover: boolean;
    mine: boolean;
    account: NodeAccountSetting;
    whisper: boolean;
    maxpeers: number;
    bootnodes: string;
    wsRPC: boolean;
    wsHost: string;
    wsPort: number;
    wsOrigins: string | boolean;
    wsApi: Array<string>;
    vmdebug: boolean;
    targetGasLimit: number;
    syncMode: string;
    verbosity: number;
    proxy: boolean;
  }
  export interface BaseBlockchainClientOptions {
    config: Config;
    env: Environment;
    isDev: boolean;
    name: string;
    prettyName: string;
    defaults: BlockchainClientDefaults;
    versSupported: string;
  }

  export interface BlockchainClientDefaults {
    bin: string;
    versionsSupported: string;
    networkType?: string;
    rpcApi: Array<string>;
    wsApi: Array<string>;
    devWsApi: Array<string>;
    networkId?: number;
    targetGasLimit?: number;
  }
}