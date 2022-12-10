import FakeBaycABI from "../ABI/FakeBAYC.json"
import { useState, useEffect } from 'react'
import Web3 from "web3";

function FakeBayc(){

//State definition  
const [account, setAccount] = useState(null);
const [chain, setChain] = useState(null); 
const [web3, setWeb3] = useState(null);
const [fakeBAYCbalance, setFakeBAYCbalance] = useState(null);
const isActive =false;



useEffect(() => {
    activate();
    checkNetwork();
}, [])

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
    await setChain(chainID)
  }
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

async function getFakeBAYCinfo(){
    const fakeBaycData = FakeBaycABI.networks[chain]

    if(fakeBaycData){
        const fakeBaycABI = new web3.eth.Contract(FakeBaycABI.abi, fakeBaycData.address)
        let fakeBAYCbalance = await fakeBaycABI.methods.tokenCounter().call()
        setFakeBAYCbalance(fakeBAYCbalance.toString());
        console.log(fakeBAYCbalance)
    } else{
        window.alert('Error : FakeBAYC contract not deployed / no detected network')
    }
}

async function claim(){
    const fakeBaycData = FakeBaycABI.networks[chain]

    if(fakeBaycData){
        const fakeBaycABI = new web3.eth.Contract(FakeBaycABI.abi, fakeBaycData.address)
        await fakeBaycABI.methods.claimAToken().send({from:account})
        console.log("minted")
    } else{
        window.alert('Error : FakeBAYC contract not deployed / no detected network')
    }
}

 //render
    return (
        <div>
            <button onClick={getFakeBAYCinfo}>Click here to get FakeBAYC info</button>
            {fakeBAYCbalance && <>
            <div style={{color:"black"}}>FakeBayc number: {fakeBAYCbalance}</div>
            </>
            }            
            <button onClick={claim}>Claim New Token</button>
        </div>
    ); 
}


export default FakeBayc; 