import { task } from 'hardhat/config';

import { eOasysNetwork, eContractid, eEthereumNetwork } from '../../helpers/types';
import { getFirstSigner, saveDeploymentCallData } from '../../helpers/contracts-helpers';
import {
  exportInitializableAdminUpgradeabilityProxyDeploymentCallData,
  exportPullRewardsIncentivesControllerDeploymentCallData,
  exportStakedTokenIncentivesControllerDeploymentCallData,
} from '../../helpers/contracts-accessors';

const {
  PullRewardsIncentivesController,
  StakedTokenIncentivesController,
  PullRewardsIncentivesControllerProxy,
  StakedTokenIncentivesControllerProxy,
} = eContractid;

task(
  `export-deploy-calldata-incentives`,
  `Export deployment calldata of the ${PullRewardsIncentivesController} and ${StakedTokenIncentivesController} contract`
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-DRE');
  const network = localBRE.network.name as eEthereumNetwork | eOasysNetwork;
  console.log(`\n- ${StakedTokenIncentivesController} exporting...`);
  console.log(`\Exporting ${StakedTokenIncentivesController} calldata ...`);
  const stakedTokenIncentives = await exportStakedTokenIncentivesControllerDeploymentCallData();
  await saveDeploymentCallData(StakedTokenIncentivesController, stakedTokenIncentives);
  const stakedTokenIncentivesProxy =
    await exportInitializableAdminUpgradeabilityProxyDeploymentCallData();
  await saveDeploymentCallData(StakedTokenIncentivesControllerProxy, stakedTokenIncentivesProxy);

  console.log(`\Exporting ${PullRewardsIncentivesController} transparent proxy calldata ...`);

  const pullRewardsIncentives = await exportPullRewardsIncentivesControllerDeploymentCallData();
  await saveDeploymentCallData(PullRewardsIncentivesController, pullRewardsIncentives);
  const pullRewardsIncentivesProxy =
    await exportInitializableAdminUpgradeabilityProxyDeploymentCallData();
  await saveDeploymentCallData(PullRewardsIncentivesControllerProxy, pullRewardsIncentivesProxy);

  console.log(`\tFinished Incentives proxy and implementation exporting`);
});
