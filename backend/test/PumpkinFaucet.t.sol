// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "forge-std/console2.sol";

import {PumpkinFaucet} from "../src/PumpkinFaucet.sol";
import {PumpkinToken} from "../src/PumpkinToken.sol";

contract PumpkinFaucetTest is Test {
    PumpkinToken token;
    PumpkinFaucet faucet;
    address owner = address(1);
    address user = address(2);
    uint dripLimit = 100;
    uint dripInterval = 10 seconds;

    function setUp() public{
      token= new PumpkinToken(owner);
      vm.startPrank(owner);
      faucet =new PumpkinFaucet(address(token),dripInterval,dripLimit);
      vm.deal(user,100 ether);
      vm.deal(owner,100 ether);
      token.mint(1000);

      vm.stopPrank();
    }

    modifier ownerDeposit(){
      vm.startPrank(owner);
      token.approve(address(faucet),1000);
      faucet.deposit(1000);
      vm.stopPrank();
      vm.warp(1000);

      _;
    }
    
    function testSuccessIfOwnerSetDripLimit() public{
      uint newLimit = 200;

      vm.startPrank(owner);
      faucet.setDripLimit(newLimit);
      vm.stopPrank();
      assertEq(newLimit,faucet.dripLimit());
    }

    function testSuccessIfOwnerSetDripInterval() public{
      uint newInterval = 20;

      vm.startPrank(owner);
      faucet.setDripInterval(newInterval);
      vm.stopPrank();
      assertEq(newInterval,faucet.dripInterval());
    }

    function testSuccessIfOwnerSetTokenAddress() public{
      address newTokenAddress = address(0x123);

      vm.startPrank(owner);
      faucet.setTokenAddress(newTokenAddress);
      vm.stopPrank();
      assertEq(newTokenAddress,address(faucet.token()));
    }

    function testSuccessIfOwnerDepodist() public{
      vm.startPrank(owner);
      token.approve(address(faucet),1_000);
      faucet.deposit(1000);
      vm.stopPrank();
      assertEq(1000,token.balanceOf(address(faucet)));
    }

    function testSuccessIfUserDrip() public ownerDeposit{
      vm.startPrank(user);
      // console2.log(block.timestamp);
      faucet.drip(1);
      vm.stopPrank();
      assertEq(1,token.balanceOf(user));
    }

    function testRevertIfTimeHasNotPassed() public {
      vm.startPrank(owner);
      token.approve(address(faucet),1000);
      faucet.deposit(1000);
      vm.stopPrank();
      vm.prank(user);
      vm.expectRevert(abi.encodeWithSelector(PumpkinFaucet.Faucet_TooFrequently.selector));
      faucet.drip(1);
    }

    function testRevertIfAmountLimit() public ownerDeposit{
      vm.startPrank(user);
      vm.expectRevert(abi.encodeWithSelector(PumpkinFaucet.Faucet_ExceedLimit.selector));
      faucet.drip(101);
      vm.stopPrank();
    }

    function testRevertIfFaucetEmpty() public ownerDeposit{
      vm.prank(owner);
      faucet.setDripLimit(1000);
      vm.startPrank(user);
      faucet.drip(1000);
      vm.warp(block.timestamp + dripInterval+1);
      // console2.log(block.timestamp);

      // console2.log(faucet.dripTime(user));
      vm.expectRevert(abi.encodeWithSelector(PumpkinFaucet.Faucet_FaucetEmpty.selector));
      faucet.drip(1);
      vm.stopPrank();
    }

    function testDripTimeRightAfterUserDrip() public ownerDeposit{
      vm.startPrank(user);
      faucet.drip(1);
      vm.stopPrank();
      assertEq(block.timestamp,faucet.lastDripTime(user));
    }
}
