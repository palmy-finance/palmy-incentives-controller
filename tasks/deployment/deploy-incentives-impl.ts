import { task } from 'hardhat/config';
import { deploy } from '../../helpers/contracts-accessors';
import { getDefenderRelaySigner } from '../../helpers/defender-utils';
import { eContractid, eNetwork } from '../../helpers/types';
import { getFirstSigner, registerContractAddressInJsonDb } from '../../helpers/contracts-helpers';

task(
  'deploy-incentives-impl',
  'Deploy and Initialize the StakedTokenIncentivesController contract'
).setAction(async ({}, localBRE) => {
  await localBRE.run('set-DRE');
  const network = localBRE.network.name as eNetwork;
  // setup deployer
  let deployer;
  if (process.env.DEFENDER_API_KEY && process.env.DEFENDER_SECRET_KEY) {
    const { signer } = await getDefenderRelaySigner();
    deployer = signer;
  } else {
    const [signer] = await localBRE.ethers.getSigners();
    deployer = signer;
  }

  const deployerAddress = await deployer.getAddress();
  console.log(`deployerAddress ... ${deployerAddress}`);

  const networkName = localBRE.network.name as eNetwork;
  console.log(`[StakedTokenIncentivesController] Starting deployment:`);
  console.log(`  - Network name: ${networkName}`);

  const impl = await deploy(eContractid.StakedTokenIncentivesController, network);
  console.log(
    `  - Deployed implementation of ${eContractid.StakedTokenIncentivesController}: address - ${impl.contractAddress}`
  );
  await registerContractAddressInJsonDb(
    eContractid.StakedTokenIncentivesController,
    impl.contractAddress,
    await (await getFirstSigner()).getAddress()
  );

  const proxy = await deploy(eContractid.StakedTokenIncentivesControllerProxy, network);
  console.log(
    `  - Deployed proxy of ${eContractid.StakedTokenIncentivesController}: address - ${proxy.contractAddress}`
  );
  await registerContractAddressInJsonDb(
    eContractid.StakedTokenIncentivesControllerProxy,
    proxy.contractAddress,
    await (await getFirstSigner()).getAddress()
  );
});
