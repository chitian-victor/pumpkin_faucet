// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

// 控制台打印输出的包
// import "forge-std/console2.sol"; 

contract  PumpkinFaucet is Ownable,ReentrancyGuard {
    // 可以直接利用现成的 SafeERC20 库，避免手动检查和处理转账失败的情况
    using SafeERC20 for IERC20;

    // 这里变量定义为了 public，会自动生成 Getter 函数的，比如 dripInterval()uint256
    IERC20 public token;
    uint256 public dripInterval;
    uint256 public dripLimit;
    // public 关键字会自动生成 getter: function lastDripTime(address) external view returns (uint256)
    mapping(address => uint256) public lastDripTime;

    error Faucet_TooFrequently();
    error Faucet_ExceedLimit();
    error Faucet_FaucetEmpty();
    error Faucet_InvalidAmount();
    error Faucet_InvalidAddress();
    error Faucet_DepositFailed();

    event Drip(address indexed receiver, uint256 indexed amount);
    event Deposit(uint256 indexed amount);
    event TokenUpdated(address indexed from, address indexed to);

    // 定义一个事件，当合约所有者存入代币时触发，记录存入的代币数量。
    constructor(
        address _tokenAddress,
        uint256 _dripInterval,
        uint256 _dripLimit
    ) Ownable(_msgSender()) {
        token = IERC20(_tokenAddress);
        dripInterval = _dripInterval;
        dripLimit = _dripLimit;
    }

    // 用户调用该函数领取代币
    function drip(uint256 _amount) external nonReentrant {
        uint256 targetAmount = _amount;
        if (block.timestamp < lastDripTime[_msgSender()] + dripInterval) {
            revert Faucet_TooFrequently();
        }
        if (targetAmount > dripLimit) {
            revert Faucet_ExceedLimit();
        }
        if (token.balanceOf(address(this)) < targetAmount) {
            revert Faucet_FaucetEmpty();
        }
        lastDripTime[_msgSender()] = block.timestamp;
        token.safeTransfer(_msgSender(), targetAmount);
        emit Drip(_msgSender(), targetAmount);
    }

    // 任何人都可以给水龙头捐赠代币，前提需要先调用 token 的 approve 方法，
    // 因为传给 token 合约的 msg.sender 是 faucet 合约地址
    function deposit(uint256 _amount) external {
        token.safeTransferFrom(msg.sender, address(this), _amount);
        emit Deposit(_amount);
    }

    /* 管理员功能 */
    function setDripInterval(uint256 _newDripInterval) public onlyOwner {
        dripInterval = _newDripInterval;
    }

    function setDripLimit(uint256 _newDripLimit) public onlyOwner {
        dripLimit = _newDripLimit;
    }

    function setTokenAddress(address _newTokenAddress) external onlyOwner {
        if (_newTokenAddress == address(0)) revert Faucet_InvalidAddress();
        token = IERC20(_newTokenAddress);
        emit TokenUpdated(address(token), _newTokenAddress);
    }
    // 紧急提款功能：防止合约 bug 导致资金被锁
    function withdrawAssets(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}
