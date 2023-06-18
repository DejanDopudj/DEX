const { assert } = require('chai');

const Token = artifacts.require("Token");
const StableToken = artifacts.require("StableToken");
const Exchange = artifacts.require("Exchange");

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('Exchange', (accounts) => {
    let token,exchange, stableToken

    before(async() => {
        token = await Token.new(); 
        stableToken = await StableToken.new(); 
        exchange = await Exchange.new(token.address, stableToken.address); 
        await token.transfer(exchange.address, '995000');
        await token.transfer(accounts[1], '10000');
        await token.transfer(accounts[2], '1000');
        await token.transfer(accounts[3], '4000');

        await stableToken.transfer(exchange.address, '9995000');
        await stableToken.transfer(accounts[1], '5000');
        await stableToken.transfer(accounts[2], '5000');
        
        await token.approve(exchange.address, '1000', {from: accounts[2]})
        await exchange.invest('1000', 0, {from: accounts[2]});
        await token.approve(exchange.address, '4000', {from: accounts[3]})
        await exchange.invest('4000', 0, {from: accounts[3]});
        await stableToken.approve(exchange.address, '5000', {from: accounts[2]})
        await exchange.invest('5000', 1, {from: accounts[2]});
    })

    describe('Exchange deployment', async() => {
        it('has a name', async() => {
            const name = await exchange.name();
            assert.equal(name, 'Swap Exchange');
        })

        it('has tokens', async() => {
            const balance = await token.balanceOf(exchange.address); 
            const balance2 = await stableToken.balanceOf(exchange.address); 
            assert.equal(balance.toString(), '1000000');
            assert.equal(balance2.toString(), '10000000');
        })
    })    
    
    describe('Token deployment', async() => {
        it('has a name', async() => {
            const name = await token.name();
            assert.equal(name, 'Custom Token');
        })
    })

    describe('StableToken deployment', async() => {
        it('has a name', async() => {
            const name = await stableToken.name();
            assert.equal(name, 'Stable Token');
        })
    })

    describe('Buy tokens2', async() => {
        it('allows user to purchase tokens', async() => {
            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '10000')

            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '1000000')
        })
    })

    describe('Sell tokens', async() => {
        it('allows user to sell tokens', async() => {

            let investorBalanceStable5 = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable5.toString(), '5000')

            await token.approve(exchange.address, '10000', {from: accounts[1]})
            await exchange.sellTokens('10000', {from: accounts[1]});

            console.log(await exchange.sayHello());

            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '0')

            let investorBalanceStable = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable.toString(), '99058')

            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '1010000')
            
            let exchangeBalanceStable = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalanceStable.toString(), '9900991')
        })
    })
    
    describe('Buy tokens', async() => {
        it('allows user to purchase tokens', async() => {
            await stableToken.approve(exchange.address, '5000', {from: accounts[1]})
            await exchange.buyTokens('5000', {from: accounts[1]});

            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '483')

            let exchangeBalance = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '9905991')

            let exchangeBalanceToken = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalanceToken.toString(), '1009492')
        })
    })

})