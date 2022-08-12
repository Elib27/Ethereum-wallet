import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Wallet from './artifacts/contracts/wallet.sol/Wallet.json'
import './App.css'

const WalletAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {

  const [balance, setBalance] = useState(0)
  const [amountSend, setAmountSend] = useState()
  const [amountWithdraw, setAmountWithdraw] = useState()
  const [error, setError] = useState()
  const [succes, setSucces] = useState()

  useEffect(() => {
    getBalance()
  })

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'})
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider)
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides)
        setBalance(String(data))
      }
      catch(err) {
        console.log(err)
        setError('Error')
      }
    }
  }

  return (
    <div className="App">
      { error && <p className='error'>{error}</p> }
      <h2>{ balance / 10**18 }</h2>
    </div>
  );
}

export default App;
