import { useState, useEffect } from 'react'
import Web3 from "web3";

function ChainInfo(){

//State definition  
const [account, setAccount] = useState(null);
const [chain, setChain] = useState(null); 
const [block, setBlock] = useState(null);
const [web3, setWeb3] = useState(null);


// useEffect(() => {
//   checkAccount()
// }, [])

// invoke to connect to wallet account
async function activate() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      checkAccount()
    } catch (err) {
      console.log('user did not add account...', err)
    }
  }
}

// invoke to check if account is already connected
async function checkAccount() {
  let web3 = new Web3(window.ethereum)
  setWeb3(web3)
  const accounts = await web3.eth.getAccounts()
  setAccount(accounts[0])
}

async function checkNetwork(){
  let web3 = new Web3(window.ethereum)
  const chainID = await web3.eth.getChainId()
  if(chainID!="11155111"){
    await switchNetwork();
  }
  else{
    setChain(chainID)
  }
}

async function checkBlock(){
  let web3 = new Web3(window.ethereum)
  const block = await web3.eth.getBlockNumber()
  setBlock(block)
}

async function switchNetwork() {
  let web3 = new Web3(window.ethereum)
  await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x5' }],    // Sepolia n'est pas natif pour la fonction de metamask
  });
  const chainID = await web3.eth.getChainId()
  setChain(chainID)
}
  
const info = async()=>  { 

  activate();
  checkNetwork();
  checkBlock();
  
}

 //render
    return (
        <div>
          <button onClick={info}>Click here to get info</button>
            {account && chain && block && <>
              <div>Account address :<b>{account} </b> </div>
              <br></br>
              <div>Chain ID : <b>{chain}</b></div>
              <br></br>
              <div>Latest block : <b>{block}</b></div>
            </>}
        </div>
    ); 
}


export default ChainInfo; 


