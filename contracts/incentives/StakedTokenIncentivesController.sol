// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import {SafeERC20} from '../stake-v1/contracts/lib/SafeERC20.sol';
import {IERC20} from '../stake-v1/contracts/interfaces/IERC20.sol';
import {BaseIncentivesController} from './base/BaseIncentivesController.sol';
import {IStakedTokenWithConfig} from '../interfaces/IStakedTokenWithConfig.sol';

/**
 * @title StakedTokenIncentivesController
 * @notice Distributor contract for rewards to the protocol, using a staked token as rewards asset.
 * The contract stakes the rewards before redistributing them to the protocol participants.
 * The reference staked token implementation is at https://github.com/palmy-finance/palmy-stake
 * @author Palmy finance
 **/
contract StakedTokenIncentivesController is BaseIncentivesController {
  using SafeERC20 for IERC20;

  address public stakeToken;

  function initialize(address emissionManager, address _stakeToken) external initializer {
    require(_stakeToken != address(0), 'INVALID_STAKED_TOKEN');
    stakeToken = _stakeToken;
    super.initialize(_stakeToken);
    require(emissionManager != address(0), 'INVALID_EMISSION_MANAGER');
    //approves the safety module to allow staking
    IERC20(STAKE_TOKEN().STAKED_TOKEN()).safeApprove(stakeToken, type(uint256).max);
    _emissionManager = emissionManager;
  }

  function STAKE_TOKEN() public view returns (IStakedTokenWithConfig) {
    return IStakedTokenWithConfig(stakeToken);
  }

  /// @inheritdoc BaseIncentivesController
  function _transferRewards(address to, uint256 amount) internal override {
    STAKE_TOKEN().stake(to, amount);
  }
}
