import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Wallet from './artifacts/contracts/wallet.sol/Wallet.json'
import './App.css'
import EthereumLogo from './assets/ethereum_logo.svg'

const WalletAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {

  const [balance, setBalance] = useState('0')
  const [amountSend, setAmountSend] = useState('')
  const [amountWithdraw, setAmountWithdraw] = useState('')
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
        setError('Something went wrong')
      }
    }
  }

  function changeAmountSend(e) {
    const result = e.target.value.replace(/\D/g, '');
    setAmountSend(result)
  }

  async function transfer() {
    if (!amountSend) return
    setError('')
    setSucces('')
    if (typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'})
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transaction = await signer.sendTransaction(tx)
        await transaction.wait()
        setAmountSend('')
        getBalance()
        setSucces('Transfer successful')
      }
      catch(err) {
        setError('Something went wrong')
      }
    }
  }

  function changeAmountWithdraw(e) {
    const result = e.target.value.replace(/\D/g, '');
    setAmountWithdraw(result)
  }

  async function withdraw() {
    if (!amountWithdraw) return
    setError('')
    setSucces('')
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'})
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer)
    try {
      const transaction = await contract.withdraw(accounts[0], ethers.utils.parseEther(amountWithdraw))
      await transaction.wait()
      setAmountWithdraw('')
      getBalance()
      setSucces('Withdraw successful')
    }
    catch(err) {
      setError('Something went wrong')
    }
  }



  return (
    <div className="App">
      <div className='wallet_wrapper'>
        <div className='wallet_header'>
          <img src={EthereumLogo} alt='ethereum logo'/>
          { error && <div className='error'>{error}</div> }
          { succes && <div className='success'>{succes}</div> }
          <h2>{ parseInt(balance) / 10**18 }<span className='currency'>ETH</span></h2>
        </div>
        <div className='wallet_flex'>
          <div className='Lwallet'>
            <h3>Send ether</h3>
            <input type="text" placeholder="ETH amount" onChange={changeAmountSend} value={amountSend}/>
            <button onClick={transfer}>Send</button>
          </div> 
          <div className='Rwallet'>
            <h3>Withdraw ether</h3>
            <input type="text" placeholder="ETH amount" onChange={changeAmountWithdraw} value={amountWithdraw}/>
            <button onClick={withdraw}>Withdraw</button>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default App;


// ajouter champs text pour choisir l'adresse de retrait