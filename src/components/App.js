import React, { Component} from 'react';
import './App.css';
import Web3 from 'web3'
import Exchange from '../abis/Exchange.json'
import Token from '../abis/Token.json'
import StableToken from '../abis/StableToken.json'


class App extends Component {
  

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadAddress()
    await this.loadContracts()
    await this.convert()
  }

  async convert() {
    let stableTokensInExchange = await this.state.exchange.methods.getValue(1000,this.state.isSell).call()
    this.setState({stableTokensInExchange: parseInt(stableTokensInExchange.toHexString(), 16)})
    let tokensInExchange = await this.state.exchange.methods.getValue(1000,!this.state.isSell).call()
    this.setState({tokensInExchange: parseInt(tokensInExchange.toHexString(), 16)})
  }

  async loadAddress(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]})
    console.log(this.state.account)
  }

  async loadContracts(){
    const web3 = window.web3

    const token = new web3.eth.Contract(Token.abi, Token.networks['5777'].address)
    this.setState({token})
    const stableToken = new web3.eth.Contract(StableToken.abi, StableToken.networks['5777'].address)
    this.setState({stableToken})
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks['5777'].address)
    this.setState({exchange})

    const accounts = await web3.eth.getAccounts();
    
    // await token.methods.mint(7000).send({ from: this.state.account });
    // await token.methods.mint(10000).send({ from: accounts[1] });
    // await stableToken.methods.mint(1000).send({ from: this.state.account });
    // await stableToken.methods.mint(10000).send({ from: accounts[1] });

    let stableTokenBalance = await stableToken.methods.balanceOf(this.state.account).call()
    this.setState({stableTokenBalance: stableTokenBalance.toNumber()})
    
    let tokenBalance = await token.methods.balanceOf(this.state.account).call()
    this.setState({tokenBalance: tokenBalance.toNumber()})
    
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
      stableTokensInExchange: 0
    }
    this.invest = this.invest.bind(this);
    this.investStableTokens = this.investStableTokens.bind(this);
    this.convert = this.convert.bind(this);

  }


  async invest() {
    this.state.token.methods.approve(this.state.exchange.address, 1000).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const transaction = await this.state.web3.eth.getTransaction(hash);
      const number = transaction.input.substring(transaction.input.length - 64);
      const decimalNumber = parseInt(number, 16);
      this.state.exchange.methods.invest(1000, 0).send({ from: this.state.account }).on('transactionHash', (hash) => {
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

  render() {
    const { isSell } = this.state;

    return (
      <div>
   <nav className="navbar-dark fixed-top bg-dark shadow p-3">
    <div style={{color: 'white', textAlign: 'left'}}>
    DEX app
    <div style={{float: 'right'}}>address: {this.state.account}</div>
    </div>
    
  </nav>
        <div>
          DEX app
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '-50%' }}>
            <p>value 1000T = {this.state.stableTokensInExchange}ST</p>
            <p>Balance: {this.state.tokenBalance} T</p>
            <p>Balance: {this.state.stableTokenBalance} ST</p>
            <button onClick={this.toggleMode} style={{ padding: '5px 10px' }}>
                {isSell ? 'Sell' : 'Buy'}              
              </button><br></br>
              <button onClick={this.convert} style={{ padding: '5px 10px' }}>
                Convert
            </button><br></br>
            <button onClick={this.invest} style={{ padding: '5px 10px' }}>Invest</button>
            <button onClick={this.investStableTokens} style={{ padding: '5px 10px' }}>Invest stable tokens</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
