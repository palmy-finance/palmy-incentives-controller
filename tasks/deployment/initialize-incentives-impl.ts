import { getAddress, isAddress } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import {
  getEmissionManagerPerNetwork,
  getProxyAdminPerNetwork,
  getStakedTokenPerNetwork,
} from '../../helpers/constants';
import {
  getStakedTokenIncentivesController,
  getStakedTokenIncentivesControllerProxy,
} from '../../helpers/contracts-accessors';
import { notFalsyOrZeroAddress } from '../../helpers/misc-utils';
import { eContractid, eNetwork } from '../../helpers/types';
import { getContractAddress } from '../../helpers/contracts-helpers';

task(`initialize-incentives-impl`, `Initializes the StakedTokenIncentivesController contract`)
  .addFlag('verify', 'Verify contracts deployed in this script at Etherscan.')
  .addOptionalParam('stakeToken', 'StakeToken address. ref: StakedToken')
  .addOptionalParam('emissionManager', 'EmissionManager address. ref: StakedToken')
  .addOptionalParam(
    'proxyAdmin',
    `The address to be added as an Admin role at the Transparent Proxy.`
  )
  .setAction(async ({ stakeToken, emissionManager, proxyAdmin }, localBRE) => {
    await localBRE.run('set-DRE');

    const network = localBRE.network.name as eNetwork;
    const proxy = await getStakedTokenIncentivesControllerProxy(
      await getContractAddress(eContractid.StakedTokenIncentivesControllerProxy)
    );
    const impl = await getStakedTokenIncentivesController(
      await getContractAddress(eContractid.StakedTokenIncentivesController)
    );
    const stake = stakeToken || (await getStakedTokenPerNetwork(network));
    const em = emissionManager || (await getEmissionManagerPerNetwork(network));
    const admin = proxyAdmin || (await getProxyAdminPerNetwork(network));
    if (!notFalsyOrZeroAddress(stake)) {
      throw new Error('StakeToken is not set');
    }
    if (!notFalsyOrZeroAddress(em)) {
      throw new Error('EmissionManager is not set');
    }
    if (!notFalsyOrZeroAddress(admin)) {
      throw new Error('ProxyAdmin is not set');
    }

    const encodedInitialize = impl.interface.encodeFunctionData('initialize', [em, stake]);
    await proxy['initialize(address,address,bytes)'](impl.address, admin, encodedInitialize);
    console.log(`\tFinished StakedTokenIncentivesController proxy initialization`);
  });
