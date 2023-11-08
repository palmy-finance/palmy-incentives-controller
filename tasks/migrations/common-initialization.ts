import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { eEthereumNetwork, eOasysNetwork } from '../../helpers/types';
require('dotenv').config();

task('common-initialization', 'Initialize in for Main, Kovan networks').setAction(
  async ({}, localBRE) => {
    const DRE: HardhatRuntimeEnvironment = await localBRE.run('set-DRE');
    const network = DRE.network.name as eEthereumNetwork | eOasysNetwork;
    await DRE.run(`initialize-incentives-impl`, {});
    await DRE.run(`initialize-pull-rewards-incentives`, {});
  }
);
