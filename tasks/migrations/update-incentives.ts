import { task } from 'hardhat/config';
import { waitForTx } from '../../helpers/misc-utils';
import {
  getlTokenAddressPerNetwork,
  getVdTokenAddressPerNetwork,
  getIncentivesConfigPerNetwork,
} from '../../helpers/constants';
import { eNetwork } from '../../helpers/types';
import { PullRewardsIncentivesController__factory } from '../../types';
import { getEthersSigners } from '../../helpers/contracts-helpers';
require('dotenv').config();

task('update-incentives', 'Configure incentives for next 30 days').setAction(
  async ({}, localBRE) => {
    // TODO: rpc url by environments
    await localBRE.run('set-DRE');
    const [, emissionManager] = await getEthersSigners();
    const network = localBRE.network.name as eNetwork;
    const { incentiveControllerProxy } = getIncentivesConfigPerNetwork(network);
    const lTokens = getlTokenAddressPerNetwork(network);
    const variableDebtTokens = getVdTokenAddressPerNetwork(network);

    const emmissionsPerAssets = {
      [lTokens.WOAS]: '1',
      [variableDebtTokens.WOAS]: '1',
      [lTokens.WETH]: '1',
      [variableDebtTokens.WETH]: '1',
      [lTokens.WBTC]: '1',
      [variableDebtTokens.WBTC]: '1',
      [lTokens.USDC]: '1',
      [variableDebtTokens.USDC]: '1',
      [lTokens.USDT]: '1',
      [variableDebtTokens.USDT]: '1',
    };

    const incentivesControllerInstance = PullRewardsIncentivesController__factory.connect(
      incentiveControllerProxy,
      emissionManager
    );
    await incentivesControllerInstance.connect(emissionManager);
    console.log('dist end');
    console.log(
      await (
        await incentivesControllerInstance.connect(emissionManager).DISTRIBUTION_END()
      ).toNumber()
    );
    console.log('em:', await incentivesControllerInstance.EMISSION_MANAGER());
    const tx = await incentivesControllerInstance.configureAssets(
      Object.keys(emmissionsPerAssets),
      Object.values(emmissionsPerAssets)
    );
    console.log(tx);

    await waitForTx(tx);

    console.log('set distribution end');
    const distEndTx = await waitForTx(
      await incentivesControllerInstance.setDistributionEnd(
        // Date and time (GMT): Wednesday, January 1, 2025 12:00:00 AM
        1735689600
      )
    ); //current + seconds per month
    console.log(distEndTx);
    console.log(
      'new distribution end:',
      await (
        await incentivesControllerInstance.connect(emissionManager).DISTRIBUTION_END()
      ).toNumber()
    );
  }
);
