//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract PumpkinToken is ERC20, Ownable {
    // 因为ERC20里面没有这两个事件，这里定义一下，debug查看
    event Mint(address indexed user, uint256 indexed amount);
    event Burn(address indexed user, uint256 indexed amount);

    // 为了方便，这里直接写死了 token 信息，其实重复定义了，造成了 gas 浪费
    string private _name = "Pumpkin";
    string private _symbol = "PK";

    constructor(
        address owner
    ) ERC20(_name, _symbol) Ownable(owner) {}

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
        emit Mint(msg.sender, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }
}
