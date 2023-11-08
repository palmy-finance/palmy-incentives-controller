import { task } from 'hardhat/config';
import {
  getEmissionManagerPerNetwork,
  getProxyAdminPerNetwork,
  getRewardTokenPerNetwork,
  getRewardVaultPerNetwork,
} from '../../helpers/constants';
import {
  getPullRewardsIncentivesController,
  getPullRewardsIncentivesControllerProxy,
} from '../../helpers/contracts-accessors';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import { eContractid, eNetwork } from '../../helpers/types';
import { getContractAddress } from '../../helpers/contracts-helpers';

task(
  `initialize-pull-rewards-incentives`,
  `Initializes the PullRewardsIncentivesController contract`
)
  .addFlag('verify', 'Verify contracts deployed in this script at Etherscan.')
  .addOptionalParam('rewardToken', 'RewardToken address. ref: PullRewardsIncentivesController')
  .addOptionalParam('rewardsVault', 'RewardsVault address. ref: PullRewardsIncentivesController')
  .addOptionalParam(
    'emissionManager',
    'EmissionManager address. ref: PullRewardsIncentivesController'
  )
  .addOptionalParam(
    'proxyAdmin',
    `The address to be added as an Admin role at the Transparent Proxy.`
  )
  .setAction(async ({ rewardToken, rewardsVault, emissionManager, proxyAdmin }, localBRE) => {
    await localBRE.run('set-DRE');

    const network = localBRE.network.name as eNetwork;
    const proxy = await getPullRewardsIncentivesControllerProxy(
      await getContractAddress(eContractid.PullRewardsIncentivesControllerProxy)
    );
    const impl = await getPullRewardsIncentivesController(
      await getContractAddress(eContractid.PullRewardsIncentivesController)
    );
    const vault = rewardsVault || (await getRewardVaultPerNetwork(network));
    const em = emissionManager || (await getEmissionManagerPerNetwork(network));
    const reward = rewardToken || (await getRewardTokenPerNetwork(network));
    const admin = proxyAdmin || (await getProxyAdminPerNetwork(network));
    if (!notFalsyOrZeroAddress(vault)) {
      throw new Error('RewardsVault is not set');
    }
    if (!notFalsyOrZeroAddress(em)) {
      throw new Error('EmissionManager is not set');
    }
    if (!notFalsyOrZeroAddress(reward)) {
      throw new Error('RewardToken is not set');
    }
    if (!notFalsyOrZeroAddress(admin)) {
      throw new Error('ProxyAdmin is not set');
    }

    const encodedInitialize = impl.interface.encodeFunctionData('initialize', [vault, em, reward]);
    await proxy['initialize(address,address,bytes)'](impl.address, admin, encodedInitialize);
    console.log(`\tFinished PullRewardsIncentivesController proxy initialization`);
  });
