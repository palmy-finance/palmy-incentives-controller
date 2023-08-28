import { task } from 'hardhat/config';
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { deployStakedTokenIncentivesController } from '../../helpers/contracts-accessors';
import { getDefenderRelaySigner } from '../../helpers/defender-utils';

// Shibuya (astar network) addresses
const STAKED_OASYSLEND = '0x5d666338118763ca0cF6719F479491B76bc88131'; // StakedLay's (StakedTokenV2Rev3) proxy
const OASYSLEND_SHORT_EXECUTOR = '0x6543076E4315bd82129105890Bc49c18f496a528'; // PoolAdmin

task('deploy-incentives-impl-old', 'Incentives controller implementation deployment').setAction(
  async (_, localBRE) => {
    _;
    await localBRE.run('set-DRE');

    let deployer;
    if (process.env.DEFENDER_API_KEY && process.env.DEFENDER_SECRET_KEY) {
      const { signer } = await getDefenderRelaySigner();
      deployer = signer;
    } else {
      const [signer] = await localBRE.ethers.getSigners();
      deployer = signer;
    }

    const incentives = await deployStakedTokenIncentivesController(
      [STAKED_OASYSLEND], // TODO: reflect OASYSLEND_SHORT_EXECUTOR
      false, // TODO: revert
      deployer
    );
    console.log(`- Incentives implementation address ${incentives.address}`);

    return incentives.address;
  }
);
