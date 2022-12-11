import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import Web3 from "web3";
import FakeNefturianABI from "../ABI/FakeNefturian.json"
import { useParams } from 'react-router-dom';

function FakeNefturians(){
    
    const[price, setPrice]= useState(); 
    const[pricefees, setPriceFees]= useState();
    const [account, setAccount] = useState(null);
    const [chain, setChain] = useState(null); 
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

    useEffect(() => {
        startup();
        GetTokenPrice();
    }, [])

    //contract zone 
    const contract_abi = FakeNefturianABI.abi; 
    const contract_address = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED"; 
    let web3 = new Web3(window.ethereum);
    var contract = new web3.eth.Contract(contract_abi, contract_address);

    async function GetTokenPrice(){
        let prix = await contract.methods.tokenPrice().call(); //in wei
        setPriceFees(String(prix*1.001)); //in wei
        setPrice(prix)
    }
    
    async function BuyToken(){
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts' }); 
        await contract.methods.buyAToken().send({from: accounts[0], value: pricefees}).then(console.log); //send value in wei
    }
    
    return (
        <div>
            <h2><b>FakeNefturian</b></h2>
            {price &&
                <>
                    <h3>FakeNefturian Price :</h3>
                    <div><b>{web3.utils.fromWei(price, 'ether')} ETH</b></div> 
                    <br></br>
                    <br></br>
                </>
            }
            <button onClick={BuyToken}>Buy FakeNefturian Token at floor price + some fees</button>
        </div>                    
    )
    
}

export default FakeNefturians;