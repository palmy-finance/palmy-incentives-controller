import { task } from 'hardhat/config';

import { eContractid, eEthereumNetwork } from '../../helpers/types';
import { getContractAddress, getDeployArgs } from '../../helpers/contracts-helpers';
import { verifyContract } from '../../helpers/etherscan-verification';
require('dotenv').config();

task('verification', 'Verify contracts').setAction(async ({}, localBRE) => {
  await localBRE.run('set-DRE');
  if (!localBRE.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }
  const network = localBRE.network.name as eEthereumNetwork;

  await verifyContract(
    await getContractAddress(eContractid.PullRewardsIncentivesController),
    await getDeployArgs(network, eContractid.PullRewardsIncentivesController)
  );
  await verifyContract(
    await getContractAddress(eContractid.PullRewardsIncentivesControllerProxy),
    await getDeployArgs(network, eContractid.PullRewardsIncentivesControllerProxy)
  );
  await verifyContract(
    await getContractAddress(eContractid.StakedTokenIncentivesController),
    await getDeployArgs(network, eContractid.StakedTokenIncentivesController)
  );
  await verifyContract(
    await getContractAddress(eContractid.StakedTokenIncentivesControllerProxy),
    await getDeployArgs(network, eContractid.StakedTokenIncentivesControllerProxy)
  );
  console.log('\n✔️ Finished verification. ✔️');
});
