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
  StakedOasysLendV2__factory,
  StakedTokenIncentivesController__factory,
} from '../types';
import { parseEther } from '@ethersproject/units';
import { MAX_UINT_AMOUNT } from '../helpers/constants';

const topUpWalletsWithOasyslend = async (
  wallets: Signer[],
  oasyslendToken: MintableErc20,
  amount: string
) => {
  for (const wallet of wallets) {
    await waitForTx(await oasyslendToken.connect(wallet).mint(amount));
  }
};

const buildTestEnv = async (
  deployer: Signer,
  vaultOfRewards: Signer,
  proxyAdmin: Signer,
  restWallets: Signer[]
) => {
  console.time('setup');

  const oasyslendToken = await deployMintableErc20(['OasysLend', 'OAL']);

  await waitForTx(
    await oasyslendToken.connect(vaultOfRewards).mint(ethers.utils.parseEther('2000000'))
  );
  await topUpWalletsWithOasyslend(
    [restWallets[0], restWallets[1], restWallets[2], restWallets[3], restWallets[4]],
    oasyslendToken,
    ethers.utils.parseEther('100').toString()
  );

  const { incentivesProxy, stakeProxy } = await testDeployIncentivesController(
    deployer,
    vaultOfRewards,
    proxyAdmin,
    oasyslendToken
  );
  const { proxy: baseIncentivesProxy } = await DRE.run('deploy-pull-rewards-incentives', {
    emissionManager: await deployer.getAddress(),
    rewardToken: oasyslendToken.address,
    rewardsVault: await vaultOfRewards.getAddress(),
    proxyAdmin: await proxyAdmin.getAddress(),
  });

  await waitForTx(
    await oasyslendToken.connect(vaultOfRewards).approve(baseIncentivesProxy, MAX_UINT_AMOUNT)
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
    await oasyslendToken
      .connect(vaultOfRewards)
      .transfer(incentivesController.address, parseEther('1000000'))
  );

  console.timeEnd('setup');

  return {
    oasyslendToken,
    incentivesController,
    pullRewardsIncentivesController,
    oasyslendStake: StakedOasysLendV2__factory.connect(stakeProxy.address, deployer),
  };
};

before(async () => {
  await rawBRE.run('set-DRE');
  const [deployer, proxyAdmin, rewardsVault, ...restWallets] = await getEthersSigners();
  const { oasyslendToken, oasyslendStake, incentivesController, pullRewardsIncentivesController } =
    await buildTestEnv(deployer, rewardsVault, proxyAdmin, restWallets);
  await initializeMakeSuite(
    oasyslendToken,
    oasyslendStake,
    incentivesController,
    pullRewardsIncentivesController
  );
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
