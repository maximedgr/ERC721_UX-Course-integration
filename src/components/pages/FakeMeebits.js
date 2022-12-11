import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import Web3 from "web3";
import FakeMeebitsABI from "../ABI/FakeMeebits.json"
import FakeMeebitsClaimerABI from "../ABI/FakeMeebitsClaimer.json"
import Signatures from "../ABI/output-sig.json"

function FakeMeebits(){

    //states
    const [account, setAccount] = useState(null);
    const [chain, setChain] = useState(null); 
    const[tokenId, setTokenId] = useState(null);
    


     //contract zone 
     let web3 = new Web3(window.ethereum);
     //FakeMeebits
     const contract_abi = FakeMeebitsABI.abi; 
     const contract_address = "0xD1d148Be044AEB4948B48A03BeA2874871a26003"; 
     var contract = new web3.eth.Contract(contract_abi, contract_address);
     //FakeMeebitsClaimer
     const contract_claimer_abi = FakeMeebitsClaimerABI.abi; 
     const contract_claimer_address = "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55"; 
     var contract_claimer = new web3.eth.Contract(contract_claimer_abi, contract_claimer_address);

     //usefull function
     useEffect(() => {
        startup();
    }, [])
    
    // invoke to connect to wallet account
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
    



    async function Mint(){
    // check that we can mint the token
    if(await contract_claimer.methods.tokensThatWereClaimed(tokenId).call()==true){
        alert("This token has alredy been mint, change tokenId !"); //pop up
        throw Error("already minted, change tokenId !");  
    }
    else 
    {
        console.log("good to mint");
        const _signature = Signatures[tokenId].signature;  
        await contract_claimer.methods.claimAToken(tokenId,_signature).send({from: account});
        alert("token has been minted. Owner : "+account); //pop up
    }
    }

    async function PrepareMint(){
        await activate();
        await checkNetwork();
        console.log(tokenId);
        await Mint();
        console.log("token has been minted. Owner : "+account);
    }
    const handleChamp = (event)=>{
        setTokenId(event.target.value)
     }

    return (
        <div>
        <h2>Fake Meebits</h2>
        <input type="number"value={tokenId}  onChange={e=>handleChamp(e)}/>
        <button onClick={PrepareMint}>Mint Meebits</button>
        </div>                    
    )
    
}

export default FakeMeebits;