import { task } from 'hardhat/config';
import { deploy } from '../../helpers/contracts-accessors';
import { eContractid, eNetwork } from '../../helpers/types';
import { getFirstSigner, registerContractAddressInJsonDb } from '../../helpers/contracts-helpers';

task(
  `deploy-pull-rewards-incentives`,
  `Deploy and initializes the PullRewardsIncentivesController contract`
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
  .setAction(async ({}, localBRE) => {
    await localBRE.run('set-DRE');

    const network = localBRE.network.name as eNetwork;
    console.log(`[PullRewardsIncentivesController] Starting deployment:`);

    const impl = await deploy(eContractid.PullRewardsIncentivesController, network);
    console.log(
      `  - Deployed implementation of ${eContractid.PullRewardsIncentivesController}: address - ${impl.contractAddress}`
    );
    await registerContractAddressInJsonDb(
      eContractid.PullRewardsIncentivesController,
      impl.contractAddress,
      await (await getFirstSigner()).getAddress()
    );
    const proxy = await deploy(eContractid.PullRewardsIncentivesControllerProxy, network);
    console.log(
      ` - Deployed proxy of ${eContractid.PullRewardsIncentivesController}: address - ${proxy.contractAddress}`
    );
    await registerContractAddressInJsonDb(
      eContractid.PullRewardsIncentivesControllerProxy,
      proxy.contractAddress,
      await (await getFirstSigner()).getAddress()
    );

    return {
      proxy: proxy.contractAddress,
      implementation: impl.contractAddress,
    };
  });
