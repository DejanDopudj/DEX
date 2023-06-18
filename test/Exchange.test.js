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
        await token.transfer(exchange.address, '400');
        await token.transfer(accounts[1], '500');
        await stableToken.transfer(accounts[1], '50');
        await stableToken.transfer(accounts[2], '100');
        await token.transfer(accounts[2], '100');
        await stableToken.transfer(exchange.address, '400');
        
        await token.approve(exchange.address, '100', {from: accounts[2]})
        await exchange.invest('100',0, {from: accounts[2]});
        await stableToken.approve(exchange.address, '100', {from: accounts[2]})
        await exchange.invest('100',1, {from: accounts[2]});
    })

    describe('Exchange deployment', async() => {
        it('has a name', async() => {
            const name = await exchange.name();
            assert.equal(name, 'Swap Exchange');
        })

        it('has tokens', async() => {
            const balance = await token.balanceOf(exchange.address); 
            const balance2 = await stableToken.balanceOf(exchange.address); 
            assert.equal(balance.toString(), '500');
            assert.equal(balance2.toString(), '500');
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
            assert.equal(investorBalance.toString(), '500')

            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '500')
        })
    })

    describe('Sell tokens', async() => {
        it('allows user to sell tokens', async() => {

            let investorBalanceStable5 = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable5.toString(), '50')

            await token.approve(exchange.address, '100', {from: accounts[1]})
            await exchange.sellTokens('100', {from: accounts[1]});

            console.log(await exchange.sayHello());

            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '400')

            let investorBalanceStable = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable.toString(), '128')

            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '600')
            
            let exchangeBalanceStable = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalanceStable.toString(), '418')
        })
    })
    
    describe('Buy tokens', async() => {
        it('allows user to purchase tokens', async() => {
            await stableToken.approve(exchange.address, '82', {from: accounts[1]})
            await exchange.buyTokens('82', {from: accounts[1]});

            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '493')

            let exchangeBalance = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '500')

            let exchangeBalanceToken = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalanceToken.toString(), '503')
        })
    })

})