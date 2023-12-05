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
export const PERMISSIONED_CONTRACT_FACTORY_ADDRESS = '0x123e3ae459a8D049F27Ba62B8a5D48c68A100EBC';

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
      [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773', // Initial admin
      [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773', // Initial admin
    },
    network
  );

export const getStakedTokenPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO', // StakedOas
      [eEthereumNetwork.rinkeby]: 'TODO', // StakedOas
      [eOasysNetwork.oasys]: 'TODO', // Proxy-StakedOas
      [eOasysNetwork.testnet]: '0x5ed8FA955719c6f75e11742E60b03DAF4Fe5d698', // Proxy-StakedOas
    },
    network
  );

export const getEmissionManagerPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO',
      [eEthereumNetwork.rinkeby]: 'TODO',
      [eOasysNetwork.oasys]: '0xf85e58B1c32EEcCfdc48A31D991C265e87681CED', // Initial admin
      [eOasysNetwork.testnet]: '0xf85e58B1c32EEcCfdc48A31D991C265e87681CED', // Initial admin
    },
    network
  );

export const getRewardTokenPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: 'TODO',
      [eEthereumNetwork.rinkeby]: 'TODO',
      [eOasysNetwork.oasys]: '0x5200000000000000000000000000000000000001', // WOAS
      [eOasysNetwork.testnet]: '0x5200000000000000000000000000000000000001', // WOAS
    },
    network
  );

export const getRewardVaultPerNetwork = (network: eNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.kovan]: ZERO_ADDRESS,
      [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
      [eOasysNetwork.oasys]: 'TODO',
      [eOasysNetwork.testnet]: '0xaf15E4465402592b48E75D1f9984ec2789ddfa97', // RewardsVaultProxy
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
        WETH: '0xd152840f689d5049ab236af8cd52002B395D8Fde',
        PLMY: 'TODO',
        WBTC: '0x89910B4E8904AA39f4F347334Bb6252Fb5982BaA',
        WOAS: '0x483a6AF5c662B2a60d967f8F1Ccf5Ea55e300e30',
        USDC: '0xDf146c733913cd765Fa3CEB44FDc826e55b2Aa79',
        USDT: '0x8e5CAD32Ea669640FCB94476b7bD620497Fc8bdf',
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
        WETH: '0x1Bc11e591DecE76d58DE002cAF7C3988f0DeDD02',
        PLMY: 'TODO',
        WBTC: '0xc19e7C43B2dBc3601c80973026f4Cd03e1BCa1Dd',
        WOAS: '0xb9AD3a3f87a471D7f3062838f0217158a295ee53',
        USDC: '0x7B5a75F8Cc2efE6e1b55f330dd2ABc7aa6F36038',
        USDT: '0x503e95f991aA9C673F2C939943825261f3b52fb9',
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
        addressProvider: '0x30F20C93f4Ee20eEd65836485C3e0c2Eb6271be6',
        rewardsVault: '0xaf15E4465402592b48E75D1f9984ec2789ddfa97',
        incentiveControllerImpl: '0xfaa65742467BAA33398900bB62B14FE09e17919e',
        incentiveControllerProxy: '0xF9989396817007b7Bb9290f0885821D8798c79e1',
        lendingPool: '0x960E892f70c494C8c33D7eF0C86501A396E55b38',
        poolConfigurator: '0x270A56B6c640C17230AC907ca804e66fF4F79d66',
        palmyToken: '0x9a76Fd958Ba7D94615BEebbD91402F2e6D3F4D2b',
      },
    },
    network
  );
