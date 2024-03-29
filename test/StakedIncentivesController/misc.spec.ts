import { timeLatest, waitForTx } from '../../helpers/misc-utils';

import { expect } from 'chai';

import { makeSuite } from '../helpers/make-suite';
import {
  deployInitializableAdminUpgradeabilityProxy,
  deployMintableErc20,
  deployStakedTokenIncentivesController,
} from '../../helpers/contracts-accessors';
import { MAX_UINT_AMOUNT, RANDOM_ADDRESSES, ZERO_ADDRESS } from '../../helpers/constants';
import { StakedTokenIncentivesController__factory } from '../../types';
import { deployStakedOasV2 } from '../helpers/deploy';

makeSuite('IncentivesController misc tests', (testEnv) => {
  it('initializer should assign correct params', async () => {
    const { users } = testEnv;
    const emissionManager = users[0];
    const proxyAdmin = RANDOM_ADDRESSES[1];

    const token = await deployMintableErc20(['Token', 'TOKEN']);
    const stkTokenProxy = await deployInitializableAdminUpgradeabilityProxy();
    const incentiveProxy = await deployInitializableAdminUpgradeabilityProxy();
    const stkTokenImpl = await deployStakedOasV2([
      token.address,
      token.address,
      '0', // dummy
      '0', // dummy
      RANDOM_ADDRESSES[0], // dummy
      RANDOM_ADDRESSES[0], // dummy
      '0', // dummy
    ]);
    const incentiveImpl = await deployStakedTokenIncentivesController();
    // @ts-ignore
    const stkTokenEncodedParams = stkTokenImpl.interface.encodeFunctionData('initialize', []);
    const incentiveEncodedParams = incentiveImpl.interface.encodeFunctionData('initialize', [
      emissionManager.address,
      stkTokenProxy.address,
    ]);
    await (
      await stkTokenProxy.functions['initialize(address,address,bytes)'](
        stkTokenImpl.address,
        proxyAdmin,
        stkTokenEncodedParams
      )
    ).wait();
    await (
      await incentiveProxy.functions['initialize(address,address,bytes)'](
        incentiveImpl.address,
        proxyAdmin,
        incentiveEncodedParams
      )
    ).wait();
    const connectedImpl = StakedTokenIncentivesController__factory.connect(
      incentiveProxy.address,
      emissionManager.signer
    );

    await expect((await connectedImpl.EMISSION_MANAGER()).toString()).to.be.equal(
      emissionManager.address
    );
    await expect((await connectedImpl.REWARD_TOKEN()).toString()).to.be.equal(
      stkTokenProxy.address
    );
  });

  it('Should return same index while multiple asset index updates', async () => {
    const { lDaiMock, incentivesController, users } = testEnv;
    await waitForTx(await incentivesController.configureAssets([lDaiMock.address], ['100']));
    await waitForTx(await lDaiMock.doubleHandleActionOnAic(users[1].address, '2000', '100'));
  });

  // TODO: add case index overflow
  //it('Should overflow index if passed a large emission', async () => {
  //  const { lDaiMock, incentivesController, users } = testEnv;
  //  const MAX_104_UINT = '20282409603651670423947251286015';
  //
  //  await waitForTx(
  //    await incentivesController.configureAssets([lDaiMock.address], [MAX_104_UINT])
  //  );
  //  await expect(
  //    lDaiMock.doubleHandleActionOnAic(users[1].address, '2000', '100')
  //  ).to.be.revertedWith('Index overflow');
  //});

  it('Should configureAssets revert if parameters length does not match', async () => {
    const { lDaiMock, incentivesController } = testEnv;

    await expect(
      incentivesController.configureAssets([lDaiMock.address], ['1', '2'])
    ).to.be.revertedWith('INVALID_CONFIGURATION');
  });

  it('Should configureAssets revert if emission parameter overflows uin104', async () => {
    const { lDaiMock, incentivesController } = testEnv;

    await expect(
      incentivesController.configureAssets([lDaiMock.address], [MAX_UINT_AMOUNT])
    ).to.be.revertedWith('Index overflow at emissionsPerSecond');
  });

  it('Should REWARD_TOKEN getter returns the stake token address to keep old interface compatibility', async () => {
    const { incentivesController, stakedToken } = testEnv;
    await expect(await incentivesController.REWARD_TOKEN()).to.be.equal(stakedToken.address);
  });

  it('Should claimRewards revert if to argument is ZERO_ADDRESS', async () => {
    const { incentivesController, users, lDaiMock } = testEnv;
    const [userWithRewards] = users;

    await waitForTx(await incentivesController.configureAssets([lDaiMock.address], ['2000']));
    await waitForTx(await lDaiMock.setUserBalanceAndSupply('300000', '30000'));

    // Claim from third party claimer
    await expect(
      incentivesController
        .connect(userWithRewards.signer)
        .claimRewards([lDaiMock.address], MAX_UINT_AMOUNT, ZERO_ADDRESS)
    ).to.be.revertedWith('INVALID_TO_ADDRESS');
  });
});
