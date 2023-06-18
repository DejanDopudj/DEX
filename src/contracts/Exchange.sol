pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";
import "./StableToken.sol";

contract Exchange{
    string public name = "Swap Exchange";
    Token public token;
    StableToken public stableToken;
    mapping(address => uint256) public tokenInvestments;
    mapping(address => uint256) public stableTokenInvestments;
    address[] public tokenInvestors;
    address[] public stableTokenInvestors;
    uint256 public tokenTotalInvestment;
    uint256 public stableTokenTotalInvestment;

    


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
        token.transfer(msg.sender, returnAmount*95/100);
        distributeTokenInvestorRewards(returnAmount); 
    }

    function sellTokens(uint _amount) public{
        uint tokenBalance = token.balanceOf(address(this));
        uint stableTokenBalance = stableToken.balanceOf(address(this)); 
        uint product = tokenBalance * stableTokenBalance;
        uint stableTokenLeft = product/(tokenBalance + _amount) + (product % (tokenBalance + _amount) > 0 ? 1 : 0);
        token.transferFrom(msg.sender, address(this), _amount);
        uint returnAmount = stableTokenBalance - stableTokenLeft;
        stableToken.transfer(msg.sender, returnAmount*95/100);
        distributeStableTokenInvestorRewards(returnAmount);
    }

    function investTokens(uint _amount) public{
        token.transferFrom(msg.sender, address(this), _amount);
        tokenInvestors.push(msg.sender);
        tokenInvestments[msg.sender] += _amount;
        tokenTotalInvestment += _amount;
    }    
    
    function investStableTokens(uint _amount) public{
        stableToken.transferFrom(msg.sender, address(this), _amount);
        stableTokenInvestors.push(msg.sender);
        stableTokenInvestments[msg.sender] += _amount;
        stableTokenTotalInvestment += _amount;
    }

    function sayHello() view public returns (address) {
        return tokenInvestors[0];
    }

    function distributeTokenInvestorRewards(uint256 _tokenAmount) internal {
        uint256 rewards = (_tokenAmount * 5) / 100;

        for (uint i=0; i < tokenInvestors.length; i++) {
            address investorAddress = tokenInvestors[i];
            uint256 investorPercentage = (tokenInvestments[investorAddress] * 100) / tokenTotalInvestment;
            uint256 investorReward = (rewards * investorPercentage) / 100;
            token.transfer(investorAddress, investorReward);
        }
    }


    function distributeStableTokenInvestorRewards(uint256 _tokenAmount) internal {
        uint256 rewards = (_tokenAmount * 5) / 100;

        for (uint i=0; i < stableTokenInvestors.length; i++) {
            address investorAddress = stableTokenInvestors[i];
            uint256 investorPercentage = (stableTokenInvestments[investorAddress] * 100) / stableTokenTotalInvestment;
            uint256 investorReward = (rewards * investorPercentage) / 100;
            stableToken.transfer(investorAddress, investorReward);
        }
    }

}

