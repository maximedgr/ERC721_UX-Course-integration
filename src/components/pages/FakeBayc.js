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
    startup();
}, [])

// invoke to connect to wallet account
async function activate() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return checkAccount();
    } catch (err) {
      console.log("etape 4 error")
      console.log('user did not add account...', err)
    }
  }
}

async function startup(){
  let wib3 ,walleti= await activate();
  let id =await checkNetwork();
  setWeb3(wib3);
  setAccount(walleti);
  setChain(id);
}

// invoke to check if account is already connected
async function checkAccount() {
  let wib3 = new Web3(window.ethereum)
  const accounts = await wib3.eth.getAccounts()
  return wib3,accounts[0];
}

async function checkNetwork(){
  let wib3 = new Web3(window.ethereum)
  const chainID = await wib3.eth.getChainId()
  if(chainID!="11155111"){
    console.log("Ma chaine ",chain)
    await switchNetwork(wib3);
  }
  return chainID;
}


async function switchNetwork(web3) {
  try {
    console.log("etape 9")
    await window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(11155111) }],
      })
    }
    catch (err) {
      if (err.code === 4902) {
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Sepolia Testnet",
                chainId: web3.utils.toHex(11155111),
                nativeCurrency: {
                  name: "ETH",
                  decimals: 18,
                  symbol: "ETH",
                },
                rpcUrls: ["https://rpc.sepolia.dev/"],
              },
            ],
          })
      } 
    }
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