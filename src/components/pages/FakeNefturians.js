import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import Web3 from "web3";
import FakeNefturianABI from "../ABI/FakeNefturian.json"
import { useParams } from 'react-router-dom';

function FakeNefturians(){
    
    const[price, setPrice]= useState(); 
    const[pricefees, setPriceFees]= useState();  

    useEffect(() => {
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