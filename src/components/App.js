import React, { Component} from 'react';
import './App.css';
import logo from './images/blockchain.png'
import Web3 from 'web3'
import Exchange from '../abis/Exchange.json'
import Token from '../abis/Token.json'
import StableToken from '../abis/StableToken.json'


class App extends Component {
  

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadAddress()
    await this.loadContracts()
    await this.loadInvestedValue()
  }

  convert = async (e) => {
    if (e.key === 'Enter') {
      
      const value = document.getElementById(e.target.id).value;
      
      let resultId, result;
      if(e.target.id == "convertT"){
        resultId = "convertST";
        result = await this.state.exchange.methods.getValue(value, true).call();
      }
      else{
        resultId = "convertT";
        result = await this.state.exchange.methods.getValue(value, false).call();
      }
      
      document.getElementById(resultId).value = result;
    }
  }

  async loadAddress(){
    
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    var that = this;
    this.setState({account: accounts[0]});
     window.ethereum.on('accountsChanged', function (accounts) {
      that.setState({account: accounts[0]})
        window.location.reload();
       });
  }

  async loadContracts(){
    const web3 = window.web3

    const token = new web3.eth.Contract(Token.abi, Token.networks['5777'].address)
    this.setState({token})
    const stableToken = new web3.eth.Contract(StableToken.abi, StableToken.networks['5777'].address)
    this.setState({stableToken})
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks['5777'].address)
    this.setState({exchange})

    let stableTokenBalance = await stableToken.methods.balanceOf(this.state.account).call()
    this.setState({stableTokenBalance: stableTokenBalance.toNumber() || 0})
    
    let tokenBalance = await token.methods.balanceOf(this.state.account).call()
    this.setState({tokenBalance: tokenBalance.toNumber() || 0})
    
  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
      this.state.web3 = window.web3;
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
      this.state.web3 = window.web3;
    }
    
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: {},
      account: '',
      ethBalance: 0,
      token: {},
      stableToken: {},
      stableTokenBalance: 0,
      tokenBalance: 0,
      exchange: {},
      isSell: false,
      tokensInExchange: 0,
      stableTokensInExchange: 0,
      investedTokens: 0,
      investedStableTokens: 0
    }
    this.invest = this.invest.bind(this);
    this.investStableTokens = this.investStableTokens.bind(this);
    this.convert = this.convert.bind(this);
    this.buyTokens = this.buyTokens.bind(this);
    this.sellTokens = this.sellTokens.bind(this);

  }

  async buyTokens(){
    this.state.stableToken.methods.approve(this.state.exchange.address, 1000
      ).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const transaction = await this.state.web3.eth.getTransaction(hash);
      const number = transaction.input.substring(transaction.input.length - 64);
      const decimalNumber = parseInt(number, 16);
      this.state.exchange.methods.buyTokens(decimalNumber).send({ from: this.state.account }).on('transactionHash', (hash) => {
      })
    })
  }

  async sellTokens(){
    this.state.token.methods.approve(this.state.exchange.address, 1000
      ).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const transaction = await this.state.web3.eth.getTransaction(hash);
      const number = transaction.input.substring(transaction.input.length - 64);
      const decimalNumber = parseInt(number, 16);
      this.state.exchange.methods.sellTokens(decimalNumber).send({ from: this.state.account }).on('transactionHash', (hash) => {
      })
    })
  }

  async invest() {
    this.state.token.methods.approve(this.state.exchange.address, 1000).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const transaction = await this.state.web3.eth.getTransaction(hash);
      const number = transaction.input.substring(transaction.input.length - 64);
      const decimalNumber = parseInt(number, 16);
      const x = await this.state.exchange.methods.invest(decimalNumber, 0).send({ from: this.state.account }).on('transactionHash', (hash) => {
      })
    })
  }  

  
  
  async investStableTokens() {
    this.state.stableToken.methods.approve(this.state.exchange.address, 1000).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const transaction = await this.state.web3.eth.getTransaction(hash);
      const number = transaction.input.substring(transaction.input.length - 64);
      const decimalNumber = parseInt(number, 16);
      this.state.exchange.methods.invest(decimalNumber, 1).send({ from: this.state.account }).on('transactionHash', (hash) => {
      })
    })
  }

  async loadInvestedValue(){
    const investedTokens = await this.state.exchange.methods.getInvestedValue(0).call({ from: this.state.account })
    this.setState({investedTokens: investedTokens.toNumber() || 0})

    const investedStableTokens = await this.state.exchange.methods.getInvestedValue(1).call({ from: this.state.account })
    this.setState({investedStableTokens: investedStableTokens.toNumber() || 0})
  }

  render() {
    return (
      <div className="main">
      <div className="header"><img src={logo} className="logo"/><span className="header-title">DEX </span>
      </div>
      <div className="content-wrapper">
          <div className="content">
              <div style={{width: "100%"}}>
                  <h1>Buy and sell</h1>
                  <table cellSpacing="0" cellPadding="0">
                  <tbody>
                      <tr className="table-header">
                          <th className="overline" colSpan={2}>Balance</th>
                      </tr>
                      <tr>
                          <th className="table-small-header">Tokens</th>
                          <th className="table-small-header">Stable tokens</th>
                      </tr>
                      <tr>
                          <td>{this.state.tokenBalance}</td>
                          <td>{this.state.stableTokenBalance}</td>
                      </tr>
                      </tbody>
                  </table>
                  <div className="flex-gap-16">
                      <button onClick={this.buyTokens}>Buy tokens</button>
                      <button onClick={this.sellTokens}>Sell tokens</button>
                  </div>
              </div>
              <hr/>
              <div>
                  <h1>Exchange rate</h1>
                  <p>Automatically convert tokens to stable tokens, and vice versa.</p>
                  <div className="flex-gap-16">
                      <div className="input-wrapper">
                          <label className="overline">Tokens</label>
                          <input id="convertT" type="number" min={0} onKeyDown={this.convert}/>
                      </div>
                      <div className="input-wrapper">
                          <label className="overline">Stable tokens</label>
                          <input id="convertST" type="number" min={0} onKeyDown={this.convert}/>
                      </div>
                  </div>
              </div>
              <hr/>
              <div style={{width: "100%"}}>
                  <h1>Invest</h1>
                  <table cellSpacing="0" cellPadding="0">
                    <tbody>
                      <tr className="table-header">
                          <th className="overline" colSpan={2}>Invested</th>
                      </tr>
                      <tr>
                          <th className="table-small-header" >Tokens</th>
                          <th className="table-small-header">Stable tokens</th>
                      </tr>
                      <tr>
                          <td>{this.state.investedTokens}</td>
                          <td>{this.state.investedStableTokens}</td>
                      </tr>
                      </tbody>
                  </table>
                  <div className="flex-gap-16">
                      <button onClick={this.invest}>Invest tokens</button>
                      <button onClick={this.investStableTokens}>Invest stable tokens</button>
                  </div>
              </div>
              <hr/>

              <div className="notes"><span className="note">* All values represented as * 10<sup>-18</sup></span>
                  <span className="note">** Due to rounding, your desired tokens may be 1 less then expected.</span></div>
          </div>
      </div>
  </div>
    );
  }
}

export default App;
