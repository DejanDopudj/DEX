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
        await token.transfer(exchange.address, '1000');
        await stableToken.transfer(exchange.address, '500');
    })

    describe('Exchange deployment', async() => {
        it('has a name', async() => {
            const name = await exchange.name();
            assert.equal(name, 'Swap Exchange');
        })

        it('has tokens', async() => {
            const balance = await token.balanceOf(exchange.address); 
            const balance2 = await stableToken.balanceOf(exchange.address); 
            assert.equal(balance.toString(), '1000');
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
            await exchange.transferAmountForFree('500',{from: accounts[1]})
            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '500')

            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '500')
        })
    })

    describe('Sell tokens', async() => {
        it('allows user to sell tokens', async() => {

            let investorBalanceStable5 = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable5.toString(), '0')

            await token.approve(exchange.address, '100', {from: accounts[1]})
            await exchange.sellTokens('100', {from: accounts[1]});


            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '400')

            let investorBalanceStable = await stableToken.balanceOf(accounts[1]);
            assert.equal(investorBalanceStable.toString(), '83')


            let exchangeBalance = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '600')

            
            let exchangeBalanceStable = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalanceStable.toString(), '417')
        })
    })
    
    describe('Buy tokens', async() => {
        it('allows user to purchase tokens', async() => {
            await stableToken.approve(exchange.address, '83', {from: accounts[1]})
            await exchange.buyTokens('83', {from: accounts[1]});

            let investorBalance = await token.balanceOf(accounts[1]);
            assert.equal(investorBalance.toString(), '499')

            let exchangeBalance = await stableToken.balanceOf(exchange.address);
            assert.equal(exchangeBalance.toString(), '500')

            let exchangeBalanceToken = await token.balanceOf(exchange.address);
            assert.equal(exchangeBalanceToken.toString(), '501')
        })
    })

})