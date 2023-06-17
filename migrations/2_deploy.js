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

    await token.transfer(exchange.address, '1000')
    await stableToken.transfer(exchange.address, '500')
};
