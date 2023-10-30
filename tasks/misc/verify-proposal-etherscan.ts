import { task } from 'hardhat/config';
import {
  PalmyProtocolDataProvider__factory,
  IERC20Detailed__factory,
  ILendingPool,
  ILendingPoolAddressesProvider__factory,
  ILendingPoolData__factory,
} from '../../types';
import { verifyContract } from '../../helpers/etherscan-verification';

const {
  POOL_PROVIDER = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
  TREASURY = '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
} = process.env;

if (!POOL_PROVIDER || !TREASURY) {
  throw new Error('You have not set correctly the .env file, make sure to read the README.md');
}

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const INCENTIVES_PROXY = '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5';

task('verify-proposal-etherscan', 'Verify proposals')
  .addParam('assets')
  .addParam('lTokens')
  .addParam('variableDebtTokens')
  .addParam('proposalPayloadAddress')
  .setAction(async ({ assets, lTokens, variableDebtTokens, proposalPayloadAddress }, localBRE) => {
    await localBRE.run('set-DRE');
    const [deployer] = await localBRE.ethers.getSigners();
    const tokensToUpdate = assets.split(',');
    lTokens = lTokens.split(',');
    variableDebtTokens = variableDebtTokens.split(',');

    // Instances
    const pool = (await localBRE.ethers.getContractAt(
      'ILendingPool',
      LENDING_POOL,
      deployer
    )) as ILendingPool;

    const poolProvider = await ILendingPoolAddressesProvider__factory.connect(
      POOL_PROVIDER,
      deployer
    );
    const protocolDataProvider = await PalmyProtocolDataProvider__factory.connect(
      await poolProvider.getAddress(
        '0x0100000000000000000000000000000000000000000000000000000000000000'
      ),
      deployer
    );

    // Params
    const reserveConfigs = (await protocolDataProvider.getAllReservesTokens())
      .filter(({ symbol }) => tokensToUpdate.includes(symbol))
      .sort(({ symbol: a }, { symbol: b }) => a.localeCompare(b));

    if (reserveConfigs.length != tokensToUpdate.length) {
      throw Error(
        "Reserves and assets missmatch. Check 'assets' task params to include all reserves"
      );
    }
    console.log('==== Etherscan verification ====');
    console.log('- Verify proposal payload');
    await verifyContract(proposalPayloadAddress, []);
    console.log('- Verify lTokens');

    // Params
    for (let x = 0; x < reserveConfigs.length; x++) {
      const { tokenAddress } = reserveConfigs[x];
      console.log(`- Verifying ${reserveConfigs[x].symbol} lToken implementation at ${lTokens[x]}`);
      const { lTokenAddress, variableDebtTokenAddress } = await pool.getReserveData(tokenAddress);

      const lTokenName = await IERC20Detailed__factory.connect(lTokenAddress, deployer).name();
      const lTokenSymbol = await IERC20Detailed__factory.connect(lTokenAddress, deployer).symbol();

      await verifyContract(lTokens[x], [
        LENDING_POOL,
        reserveConfigs[x].tokenAddress,
        TREASURY,
        lTokenName,
        lTokenSymbol,
        INCENTIVES_PROXY,
      ]);
      console.log(
        `- Verifying ${reserveConfigs[x].symbol} variable debt implementation at ${variableDebtTokens[x]}`
      );

      const varTokenName = await IERC20Detailed__factory.connect(
        variableDebtTokenAddress,
        deployer
      ).name();
      const varTokenSymbol = await IERC20Detailed__factory.connect(
        variableDebtTokenAddress,
        deployer
      ).symbol();

      await verifyContract(variableDebtTokens[x], [
        LENDING_POOL,
        reserveConfigs[x].tokenAddress,
        varTokenName,
        varTokenSymbol,
        INCENTIVES_PROXY,
      ]);
    }
  });
