import rawBRE from 'hardhat';
import { Signer, ethers } from 'ethers';
import { getBlockTimestamp, getEthersSigners } from '../helpers/contracts-helpers';
import { initializeMakeSuite } from './helpers/make-suite';
import { deployMintableErc20, deployLTokenMock } from '../helpers/contracts-accessors';
import { DRE, waitForTx } from '../helpers/misc-utils';
import { MintableErc20 } from '../types/MintableErc20';
import { testDeployIncentivesController } from './helpers/deploy';
import {
  PullRewardsIncentivesController__factory,
  StakedPalmyV2__factory,
  StakedTokenIncentivesController__factory,
} from '../types';
import { parseEther } from '@ethersproject/units';
import { MAX_UINT_AMOUNT } from '../helpers/constants';

const topUpWalletsWithPalmy = async (
  wallets: Signer[],
  palmyToken: MintableErc20,
  amount: string
) => {
  for (const wallet of wallets) {
    await waitForTx(await palmyToken.connect(wallet).mint(amount));
  }
};

const buildTestEnv = async (
  deployer: Signer,
  vaultOfRewards: Signer,
  proxyAdmin: Signer,
  restWallets: Signer[]
) => {
  console.time('setup');

  const palmyToken = await deployMintableErc20(['Palmy', 'OAL']);

  await waitForTx(
    await palmyToken.connect(vaultOfRewards).mint(ethers.utils.parseEther('2000000'))
  );
  await topUpWalletsWithPalmy(
    [restWallets[0], restWallets[1], restWallets[2], restWallets[3], restWallets[4]],
    palmyToken,
    ethers.utils.parseEther('100').toString()
  );

  const { incentivesProxy, stakeProxy } = await testDeployIncentivesController(
    deployer,
    vaultOfRewards,
    proxyAdmin,
    palmyToken
  );
  const { proxy: baseIncentivesProxy } = await DRE.run('deploy-pull-rewards-incentives', {
    emissionManager: await deployer.getAddress(),
    rewardToken: palmyToken.address,
    rewardsVault: await vaultOfRewards.getAddress(),
    proxyAdmin: await proxyAdmin.getAddress(),
  });

  await waitForTx(
    await palmyToken.connect(vaultOfRewards).approve(baseIncentivesProxy, MAX_UINT_AMOUNT)
  );

  const distributionDuration = ((await getBlockTimestamp()) + 1000 * 60 * 60).toString();
  await deployLTokenMock(incentivesProxy.address, 'lDai');
  await deployLTokenMock(incentivesProxy.address, 'lWeth');

  await deployLTokenMock(baseIncentivesProxy, 'lDaiBase');
  await deployLTokenMock(baseIncentivesProxy, 'lWethBase');

  const incentivesController = StakedTokenIncentivesController__factory.connect(
    incentivesProxy.address,
    deployer
  );
  const pullRewardsIncentivesController = PullRewardsIncentivesController__factory.connect(
    baseIncentivesProxy,
    deployer
  );

  await incentivesController.setDistributionEnd(distributionDuration);
  await pullRewardsIncentivesController.setDistributionEnd(distributionDuration);
  await waitForTx(
    await palmyToken
      .connect(vaultOfRewards)
      .transfer(incentivesController.address, parseEther('1000000'))
  );

  console.timeEnd('setup');

  return {
    palmyToken,
    incentivesController,
    pullRewardsIncentivesController,
    palmyStake: StakedPalmyV2__factory.connect(stakeProxy.address, deployer),
  };
};

before(async () => {
  await rawBRE.run('set-DRE');
  const [deployer, proxyAdmin, rewardsVault, ...restWallets] = await getEthersSigners();
  const { palmyToken, palmyStake, incentivesController, pullRewardsIncentivesController } =
    await buildTestEnv(deployer, rewardsVault, proxyAdmin, restWallets);
  await initializeMakeSuite(
    palmyToken,
    palmyStake,
    incentivesController,
    pullRewardsIncentivesController
  );
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
