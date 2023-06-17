const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
    await deployer.deploy(Token);

    const token = await Token.deployed();

    await deployer.deploy(Exchange);
    const exchange = await Exchange.deployed();

    await token.transfer(exchange.address, '100000')
};
