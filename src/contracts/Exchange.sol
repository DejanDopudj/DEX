pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";
import "./StableToken.sol";

contract Exchange{
    string public name = "Swap Exchange";
    Token public token;
    StableToken public stableToken;

    constructor(Token _token, StableToken _stableToken) public {
        token = _token;
        stableToken = _stableToken;
    }

    function buyTokens(uint _amount) public{
        uint tokenBalance = token.balanceOf(address(this));
        uint stableTokenBalance = stableToken.balanceOf(address(this)); 
        uint product = tokenBalance * stableTokenBalance;
        uint tokenLeft = product/(stableTokenBalance + _amount) + (product % (stableTokenBalance + _amount) > 0 ? 1 : 0);
        stableToken.transferFrom(msg.sender, address(this), _amount);
        uint returnAmount = tokenBalance - tokenLeft;
        token.transfer(msg.sender, returnAmount);
    }

    function sellTokens(uint _amount) public{
        uint tokenBalance = token.balanceOf(address(this));
        uint stableTokenBalance = stableToken.balanceOf(address(this)); 
        uint product = tokenBalance * stableTokenBalance;
        uint stableTokenLeft = product/(tokenBalance + _amount) + (product % (tokenBalance + _amount) > 0 ? 1 : 0);
        token.transferFrom(msg.sender, address(this), _amount);
        uint returnAmount = stableTokenBalance - stableTokenLeft;
        stableToken.transfer(msg.sender, returnAmount);
    }

    function transferAmountForFree(uint _amount) public payable{
        require(token.balanceOf(address(this)) >= _amount);
        token.transfer(msg.sender, _amount);
    }
}

