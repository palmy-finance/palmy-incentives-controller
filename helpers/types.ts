import BigNumber from 'bignumber.js';

export interface SymbolMap<T> {
  [symbol: string]: T;
}

export type eNetwork = eEthereumNetwork | eOasysNetwork;

export enum eContractid {
  DistributionManager = 'DistributionManager',
  MintableErc20 = 'MintableErc20',
  LTokenMock = 'LTokenMock',
  IERC20Detailed = 'IERC20Detailed',
  StakedTokenIncentivesController = 'StakedTokenIncentivesController',
  StakedTokenIncentivesControllerProxy = 'StakedTokenIncentivesControllerProxy',
  MockSelfDestruct = 'MockSelfDestruct',
  StakedOasV2 = 'StakedOasV2',
  PullRewardsIncentivesController = 'PullRewardsIncentivesController',
  PullRewardsIncentivesControllerProxy = 'PullRewardsIncentivesControllerProxy',
}

export enum eEthereumNetwork {
  buidlerevm = 'buidlerevm',
  kovan = 'kovan',
  rinkeby = 'rinkeby',
  main = 'main',
  coverage = 'coverage',
  hardhat = 'hardhat',
  tenderlyMain = 'tenderlyMain',
}

export enum eOasysNetwork {
  oasys = 'oasys',
  testnet = 'testnet',
}

export enum EthereumNetworkNames {
  kovan = 'kovan',
  main = 'main',
}

export type iParamsPerNetwork<T> = iEthereumParamsPerNetwork<T> | iOasysParamsPerNetwork<T>;

export interface iEthereumParamsPerNetwork<T> {
  [eEthereumNetwork.coverage]: T;
  [eEthereumNetwork.buidlerevm]: T;
  [eEthereumNetwork.kovan]: T;
  [eEthereumNetwork.rinkeby]: T;
  [eEthereumNetwork.main]: T;
  [eEthereumNetwork.hardhat]: T;
  [eEthereumNetwork.tenderlyMain]: T;
}

export interface iOasysParamsPerNetwork<T> {
  [eOasysNetwork.oasys]: T;
  [eOasysNetwork.testnet]: T;
}
export interface iAssetBase<T> {
  WETH: T;
  PLMY: T;
  WBTC: T;
  WOAS: T;
  USDC: T;
  USDT: T;
}

export interface incentivesConfig {
  palmyToken: tEthereumAddress;
  poolConfigurator: tEthereumAddress;
  addressProvider: tEthereumAddress;
  lendingPool: tEthereumAddress;
  rewardsVault: tEthereumAddress;
  incentiveControllerProxy: tEthereumAddress;
  incentiveControllerImpl: tEthereumAddress;
}

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
export type tStringTokenSmallUnits = string; // 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tBigNumberTokenSmallUnits = BigNumber;
