import { testDeployIncentivesController } from './../test/helpers/deploy';
import BigNumber from 'bignumber.js';
import { getParamPerNetwork } from './contracts-helpers';
import {
  eOasysNetwork,
  eEthereumNetwork,
  eNetwork,
  tEthereumAddress,
  iParamsPerNetwork,
  iAssetBase,
  incentivesConfig,
} from './types';

// ----------------
// MATH
// ----------------

export const PERCENTAGE_FACTOR = '10000';
export const HALF_PERCENTAGE = '5000';
export const WAD = Math.pow(10, 18).toString();
export const HALF_WAD = new BigNumber(WAD).multipliedBy(0.5).toString();
export const RAY = new BigNumber(10).exponentiatedBy(27).toFixed();
export const HALF_RAY = new BigNumber(RAY).multipliedBy(0.5).toFixed();
export const WAD_RAY_RATIO = Math.pow(10, 9).toString();
export const oneEther = new BigNumber(Math.pow(10, 18));
export const oneRay = new BigNumber(Math.pow(10, 27));
export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const ONE_YEAR = '31536000';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ONE_ADDRESS = '0x0000000000000000000000000000000000000001';

/* Buidler/Hardhat constants */

export const TEST_SNAPSHOT_ID = '0x1';
export const BUIDLEREVM_CHAINID = 31337;
export const COVERAGE_CHAINID = 1337;

export const RANDOM_ADDRESSES = [
  '0x0000000000000000000000000000000000000221',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000211',
  '0x0000000000000000000000000000000000000251',
  '0x0000000000000000000000000000000000000271',
  '0x0000000000000000000000000000000000000291',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000421',
  '0x0000000000000000000000000000000000000521',
  '0x0000000000000000000000000000000000000621',
  '0x0000000000000000000000000000000000000721',
];

/* Addresses / Parameters for each network */
export const getProxyAdminPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO', // Dummy
      [eEthereumNetwork.rinkeby]: 'TODO', // Dummy
      [eOasysNetwork.oasys]: 'TODO', // Dummy
      [eOasysNetwork.testnet]: 'TODO', // Dummy
    },
    network
  );

export const getStakedTokenPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO', // StakedPalmy
      [eEthereumNetwork.rinkeby]: 'TODO', // StakedPalmy
      [eOasysNetwork.oasys]: 'TODO', // Proxy-StakedTokenV2Rev3
      [eOasysNetwork.testnet]: 'TODO', // Proxy-StakedTokenV2Rev3
    },
    network
  );

export const getPalmyTokenPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: '',
      [eEthereumNetwork.rinkeby]: '',
      [eOasysNetwork.oasys]: 'TODO',
      [eOasysNetwork.testnet]: 'TODO',
    },
    network
  );

export const getEmissionManagerPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO',
      [eEthereumNetwork.rinkeby]: 'TODO',
      [eOasysNetwork.oasys]: 'TODO',
      [eOasysNetwork.testnet]: 'TODO',
    },
    network
  );

export const getRewardVaultPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: ZERO_ADDRESS,
      [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
      [eOasysNetwork.oasys]: 'TODO',
      [eOasysNetwork.testnet]: 'TODO',
    },
    network
  );

export const getlTokenAddressPerNetwork = (network: eNetwork): iAssetBase<tEthereumAddress> =>
  getParamPerNetwork<iAssetBase<tEthereumAddress>>(
    {
      [eEthereumNetwork.kovan]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eOasysNetwork.oasys]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
      [eOasysNetwork.testnet]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
    },
    network
  );
export const getVdTokenAddressPerNetwork = (network: eNetwork): iAssetBase<tEthereumAddress> =>
  getParamPerNetwork<iAssetBase<tEthereumAddress>>(
    {
      [eEthereumNetwork.kovan]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eOasysNetwork.oasys]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
      [eOasysNetwork.testnet]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
    },
    network
  );
export const getTokenAddressPerNetwork = (network: eNetwork): iAssetBase<tEthereumAddress> =>
  getParamPerNetwork<iAssetBase<tEthereumAddress>>(
    {
      [eEthereumNetwork.kovan]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        WETH: ZERO_ADDRESS,
        PLMY: ZERO_ADDRESS,
        WBTC: ZERO_ADDRESS,
        WOAS: ZERO_ADDRESS,
        USDC: ZERO_ADDRESS,
        USDT: ZERO_ADDRESS,
      },
      [eOasysNetwork.oasys]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
      [eOasysNetwork.testnet]: {
        WETH: 'TODO',
        PLMY: 'TODO',
        WBTC: 'TODO',
        WOAS: 'TODO',
        USDC: 'TODO',
        USDT: 'TODO',
      },
    },
    network
  );

export const getIncentivesConfigPerNetwork = (network: eNetwork): incentivesConfig =>
  getParamPerNetwork<incentivesConfig>(
    {
      [eEthereumNetwork.kovan]: {
        addressProvider: ZERO_ADDRESS,
        rewardsVault: ZERO_ADDRESS,
        incentiveControllerImpl: ZERO_ADDRESS,
        incentiveControllerProxy: ZERO_ADDRESS,
        lendingPool: ZERO_ADDRESS,
        poolConfigurator: ZERO_ADDRESS,
        palmyToken: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        addressProvider: ZERO_ADDRESS,
        rewardsVault: ZERO_ADDRESS,
        incentiveControllerImpl: ZERO_ADDRESS,
        incentiveControllerProxy: ZERO_ADDRESS,
        lendingPool: ZERO_ADDRESS,
        poolConfigurator: ZERO_ADDRESS,
        palmyToken: ZERO_ADDRESS,
      },
      [eOasysNetwork.oasys]: {
        addressProvider: 'TODO',
        rewardsVault: 'TODO',
        incentiveControllerImpl: 'TODO',
        incentiveControllerProxy: 'TODO',
        lendingPool: 'TODO',
        poolConfigurator: 'TODO',
        palmyToken: 'TODO',
      },
      [eOasysNetwork.testnet]: {
        addressProvider: 'TODO',
        rewardsVault: 'TODO',
        incentiveControllerImpl: 'TODO',
        incentiveControllerProxy: 'TODO',
        lendingPool: 'TODO',
        poolConfigurator: 'TODO',
        palmyToken: 'TODO',
      },
    },
    network
  );
