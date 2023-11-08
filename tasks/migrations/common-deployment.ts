import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { eEthereumNetwork, eOasysNetwork } from '../../helpers/types';
require('dotenv').config();

task('common-deployment', 'Deployment in for Main, Kovan networks').setAction(
  async ({}, localBRE) => {
    const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-DRE');
    const network = DRE.network.name as eEthereumNetwork | eOasysNetwork;

    await DRE.run(`export-deploy-calldata-incentives`, {});
    if (network === eOasysNetwork.oasys) {
      console.log(`\n✔️ Finished the deployment of the Oas Token ${network} Enviroment. ✔️`);
      return;
    }
    await DRE.run(`deploy-incentives-impl`, {});
    await DRE.run(`deploy-pull-rewards-incentives`, {});
  }
);
