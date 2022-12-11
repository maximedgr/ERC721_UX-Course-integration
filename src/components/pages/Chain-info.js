import { useState, useEffect } from 'react'
import Web3 from "web3";

function ChainInfo(){

//State definition  
const [account, setAccount] = useState(null);
const [chain, setChain] = useState(null); 
const [block, setBlock] = useState(null);
const [web3, setWeb3] = useState(null);


// invoke to connect to wallet account
async function activate() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return checkAccount();
    } catch (err) {
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


async function checkBlock(){
  let web3 = new Web3(window.ethereum)
  const block = await web3.eth.getBlockNumber()
  setBlock(block)
}

  
const info = async()=>  { 

  startup();
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


