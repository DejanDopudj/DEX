import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadAddress()
    await this.loadBalance()
  }

  async loadBalance(){
    const web3 = window.web3

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance : ethBalance / 1000000000000000000 })
    console.log(this.state.ethBalance)
  }

  async loadAddress(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]})
    console.log(this.state.account)
  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ethBalance: 0
    }
  }

  render() {
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
      </div>
    );
  }
}

export default App;
