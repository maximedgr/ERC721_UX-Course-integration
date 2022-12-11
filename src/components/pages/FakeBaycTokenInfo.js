import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import Web3 from "web3";
import FakeBaycABI from "../ABI/FakeBAYC.json"
import { useParams } from 'react-router-dom';

function FakeBaycTokenInfo() {
    
    //state zone 
    const[tokenId, setTokenId] = useState(); 
    const[attribute, setAttribute]= useState(); 
    const [image, setImage] = useState(""); 

    const currenttokenId  = useParams();
    useEffect(() => {
        setTokenId(currenttokenId.tokenId);
    }, [])

    //contract zone 
    const contract_abi = FakeBaycABI.abi; 
    const contract_address = "0x1dA89342716B14602664626CD3482b47D5C2005E"; 
    let web3 = new Web3(window.ethereum);
    var contract = new web3.eth.Contract(contract_abi, contract_address);

    const handleChamp = (event)=>{
        setTokenId(event.target.value)
    }

    async function GetTokenInfo(){
        let info= await contract.methods.tokenURI(tokenId).call();
        const jsonURI = await fetch(info).then(res => res.json()); 

        setAttribute(JSON.stringify(jsonURI.attributes));  
        setImage(jsonURI.image); 
        console.log(jsonURI); 
    }
    
    
    return (
        <div>
            <input type="text"value={tokenId} onChange={e=>handleChamp(e)}/>
                <br></br>
                    <button onClick={GetTokenInfo}> Get token info</button>
                    <br></br>
                <br></br>
            {image &&
                <>
                    <IpfsImage hash={image}/>
                    <div className="fbinfo">
                        <h3>Information :</h3>
                        <div>{attribute}</div>
                        <br></br>
                        <br></br>
                    </div>
                </>
            }
        </div>                    
    )
}

export default FakeBaycTokenInfo; 