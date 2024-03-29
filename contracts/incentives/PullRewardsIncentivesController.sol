// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import {IERC20} from '../stake-v1/contracts/interfaces/IERC20.sol';
import {SafeERC20} from '../stake-v1/contracts/lib/SafeERC20.sol';

import {BaseIncentivesController} from './base/BaseIncentivesController.sol';

/**
 * @title PullRewardsIncentivesController
 * @notice Distributor contract for ERC20 rewards to the protocol participants that pulls ERC20 from external account
 * @author Palmy finance
 **/
contract PullRewardsIncentivesController is BaseIncentivesController {
  using SafeERC20 for IERC20;

  address internal _rewardsVault;

  event RewardsVaultUpdated(address indexed vault);

  /**
   * @dev Initialize BaseIncentivesController
   * @param rewardsVault rewards vault to pull ERC20 funds
   **/
  function initialize(
    address rewardsVault,
    address emissionManager,
    address rewardToken
  ) external initializer {
    require(emissionManager != address(0), 'INVALID_EMISSION_MANAGER');
    require(rewardsVault != address(0), 'INVALID_REWARDS_VAULT');
    require(rewardToken != address(0), 'INVALID_REWARD_TOKEN');
    _rewardsVault = rewardsVault;
    _emissionManager = emissionManager;
    super.initialize(rewardToken);
    emit RewardsVaultUpdated(_rewardsVault);
  }

  /**
   * @dev returns the current rewards vault contract
   * @return address
   */
  function getRewardsVault() external view returns (address) {
    return _rewardsVault;
  }

  /**
   * @dev update the rewards vault address, only allowed by the Rewards admin
   * @param rewardsVault The address of the rewards vault
   **/
  function setRewardsVault(address rewardsVault) external onlyEmissionManager {
    require(rewardsVault != address(0), 'INVALID_REWARDS_VAULT');
    _rewardsVault = rewardsVault;
    emit RewardsVaultUpdated(rewardsVault);
  }

  /// @inheritdoc BaseIncentivesController
  function _transferRewards(address to, uint256 amount) internal override {
    IERC20(REWARD_TOKEN()).safeTransferFrom(_rewardsVault, to, amount);
  }
}
