pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";
import "./StableToken.sol";

contract Exchange{
    string public name = "Swap Exchange";
    Token public token;
    StableToken public stableToken;
    mapping(uint => Invest) public tokenInvestments;
    
    struct Invest{
        mapping(address => uint256) investments;
        address[] investors;
        uint256  totalInvestment;
    }

    constructor(Token _token, StableToken _stableToken) public {
        token = _token;
        stableToken = _stableToken;
        tokenInvestments[0].totalInvestment = 0;
        tokenInvestments[1].totalInvestment = 0;
    }

    function buyTokens(uint _amount) public{
        uint tokenBalance = token.balanceOf(address(this));
        uint stableTokenBalance = stableToken.balanceOf(address(this)); 
        uint product = tokenBalance * stableTokenBalance;
        uint tokenLeft = product/(stableTokenBalance + _amount) + (product % (stableTokenBalance + _amount) > 0 ? 1 : 0);
        stableToken.transferFrom(msg.sender, address(this), _amount);
        uint returnAmount = tokenBalance - tokenLeft;
        token.transfer(msg.sender, returnAmount*95/100);
        distributeInvestorRewards(returnAmount, 0); 
    }

    function sellTokens(uint _amount) public{
        uint tokenBalance = token.balanceOf(address(this));
        uint stableTokenBalance = stableToken.balanceOf(address(this)); 
        uint product = tokenBalance * stableTokenBalance;
        uint stableTokenLeft = product/(tokenBalance + _amount) + (product % (tokenBalance + _amount) > 0 ? 1 : 0);
        token.transferFrom(msg.sender, address(this), _amount);
        uint returnAmount = stableTokenBalance - stableTokenLeft;
        stableToken.transfer(msg.sender, returnAmount*95/100);
        distributeInvestorRewards(returnAmount, 1);
    }

    
    function investTokens(uint _amount) public{
        invest(_amount, 0);
    }    
    function investStableTokens(uint _amount) public{
        invest(_amount, 1);
    }    

    function invest(uint _amount, uint _tokenName) public{
        _tokenName == 0 ? token.transferFrom(msg.sender, address(this), _amount) : stableToken.transferFrom(msg.sender, address(this), _amount); 
        if(tokenInvestments[_tokenName].investments[msg.sender] == 0)
            tokenInvestments[_tokenName].investors.push(msg.sender);
        tokenInvestments[_tokenName].investments[msg.sender] += _amount;
        tokenInvestments[_tokenName].totalInvestment += _amount;
    }    

    function sayHello() view public returns (address) {
        return tokenInvestments[0].investors[0];
    }

    function distributeInvestorRewards(uint256 _tokenAmount, uint _tokenName) internal {
        uint256 rewards = _tokenAmount - (_tokenAmount * 95) / 100;

        for (uint i=0; i < tokenInvestments[_tokenName].investors.length; i++) {
            address investorAddress = tokenInvestments[_tokenName].investors[i];
            uint256 investorPercentage = (tokenInvestments[_tokenName].investments[investorAddress] * 100) / tokenInvestments[_tokenName].totalInvestment;
            uint256 investorReward = (rewards * investorPercentage) / 100;
            _tokenName == 0 ? token.transfer(investorAddress, investorReward) : stableToken.transfer(investorAddress, investorReward);
        }
    }

}

