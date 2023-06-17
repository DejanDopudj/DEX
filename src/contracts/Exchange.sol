pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";
import "./Token.sol";

contract Exchange{
    string public name = "Swap Exchange";
    Token public token;
    Token public token;
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable{
        uint tokenAmount = msg.value*rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);
    }

    function sellTokens(uint _amount) public{
        uint etherAmount = _amount / rate;

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
    }

}

