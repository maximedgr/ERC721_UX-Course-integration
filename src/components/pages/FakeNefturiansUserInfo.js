import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import Web3 from "web3";
import FakeNefturianABI from "../ABI/FakeNefturian.json"
import { useParams } from 'react-router-dom';


function FakeNefturiansUserInfo(){
    const[balance, setBalance] = useState(0);
    const [list, setList] = useState([]);
    const [userwallet, setUserWallet] = useState();

    const userAddress=useParams();
    useEffect(() => {
        setUserWallet(userAddress.userAddress);
        getBalance();
        getBalanceAndToken();
    }, []);

    //contract zone 
    const contract_abi = FakeNefturianABI.abi; 
    const contract_address = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED"; 
    let web3 = new Web3(window.ethereum);
    var contract = new web3.eth.Contract(contract_abi, contract_address);

    // retrive user balance

    async function getBalance() {
        let balance = await contract.methods.balanceOf(userwallet).call(); 
        setBalance(balance); 
    }

    async function getBalanceAndToken() {
        // get the balance of the user 
        let listing = [];
        let totalSupply = await contract.methods.totalSupply().call();
        console.log(totalSupply);
        
        for( let i = 0; i < totalSupply; i++){
          
            let tempOwner = await contract.methods.ownerOf(i).call();
            if(tempOwner == userwallet){
                let URI = await contract.methods.tokenURI(i).call();
                let fetchUri = await fetch(URI).then(res => res.json());
                listing.push(fetchUri);
                // console.log("FetURI"+fetchUri);
                // console.log("Lisitng"+listing);
             }
        }
       setList(listing);
    }

    async function Refresh(){
        await getBalance();
        await getBalanceAndToken();
    }

    const elements = list.map(item => {
        console.log(item);
        return (
          <ul key={item.name}>
            <li>{item.name}</li>
            { <IpfsImage hash={item.image}/>}
            <li>{item.description}</li>
          </ul>
        );
      });

    return (
        <div>{userwallet && <>
            <h1>Wallet address : {userAddress.userAddress}</h1> 
            <br></br>       
        </>
        }
        <button onClick={Refresh}>Refresh info</button>
        {balance && elements && <>
            <h1>Balance : {balance}</h1>
            <div>{elements}</div>
        </>}
        </div>                    
    )
    
}

export default FakeNefturiansUserInfo;