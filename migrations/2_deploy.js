const Token = artifacts.require("Token");
const StableToken = artifacts.require("StableToken");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
    await deployer.deploy(Token);
    await deployer.deploy(StableToken);

    const token = await Token.deployed();
    const stableToken = await StableToken.deployed();

    await deployer.deploy(Exchange,token.address, stableToken.address);
    const exchange = await Exchange.deployed();

    //Pool
    await token.transfer(exchange.address, '9200')
    await stableToken.transfer(exchange.address, '2000')

    //Account 4
    await token.transfer('0x5FABbDc0767fE11ab744CcF62616d9D31799677c', '1000')
    await stableToken.transfer('0x5FABbDc0767fE11ab744CcF62616d9D31799677c', '500')    

    //Account 5
    await token.transfer('0xa25c3358eebec5cf41073237ff45bd28203f48bb', '1000')
    await stableToken.transfer('0xa25c3358eebec5cf41073237ff45bd28203f48bb', '1000')

    //Account 6
    await token.transfer('0x454bAED708d523181B27e89b348Ce98A4da73ee8', '500')
    await stableToken.transfer('0x454bAED708d523181B27e89b348Ce98A4da73ee8', '700')
 
};
