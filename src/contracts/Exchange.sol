pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";
import "./StableToken.sol";

contract Exchange{
    string public name = "Swap Exchange";
    Token public token;
    StableToken public stableToken;
    uint public product;

    constructor(Token _token, StableToken _stableToken) public {
        token = _token;
        stableToken = _stableToken;
        product = token.balanceOf(address(this)) * stableToken.balanceOf(address(this));
    }

    function buyTokens() public payable{
        uint tokenAmount = msg.value;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);
    }

    function sellTokens(uint _amount) public{
        uint etherAmount = _amount;

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
    }

}

