import React,{Component} from "react";
import { NavLink } from 'react-router-dom';
import Main from "../components/pages/Main"; 
import ChainInfo from "../components/pages/Chain-info";
import FakeBayc from "../components/pages/FakeBayc";
import FakeBaycTokenInfo from "../components/pages/FakeBaycTokenInfo";
import FakeMeebits from "../components/pages/FakeMeebits"; 
import FakeNefturians from "../components/pages/FakeNefturians"; 
import FakeNefturiansUserInfo from "../components/pages/FakeNefturiansUserInfo"; 
import WrongNetwork from "../components/pages/WrongNetwork"; 
import NotFound from "../components/pages/NotFound"; 
import { useState, useEffect } from 'react';
import Web3 from "web3";



function Navbar(){

  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

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

  useEffect(() => {
    activate();
  }, [])

  return (
    <div>
    { account && <>
      <nav>
            <ul>
              <li>
                <NavLink to="/" exact>Home</NavLink>
              </li>
              <li>
                <NavLink to="/Chain-Info">Chain Info</NavLink>
              </li>
              <li>
                <NavLink to="/fakeBayc">Fake Bayc</NavLink>
              </li>
              <li>
                <NavLink to="/fakeBayc/0">Fake Bayc Info</NavLink>
              </li>
              <li>
                <NavLink to="/fakeNefturians">Fake Nefturian</NavLink>
              </li>
              <li>
                <NavLink to={`/fakeNefturians/${account}`}>Fake Nefturian user wallet</NavLink>
              </li>
            </ul>
          </nav>
          </>
    }</div>
  );
}


export default Navbar;