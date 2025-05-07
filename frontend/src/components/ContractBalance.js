import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractFile from "../utils/IkiminaSystem.json";

const contractABI = contractFile.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Replace with your actual contract address

const ContractBalance = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadBalance = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request wallet access

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        try {
          const balanceInWei = await contract.methods.getContractBalance().call();
          const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
          setBalance(balanceInEth);
        } catch (err) {
          console.error("Error fetching contract balance:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    loadBalance();
  }, []);

  return (
    <div>
      <h2>Contract Balance</h2>
      {balance === null ? (
        <p>Loading balance...</p>
      ) : (
        <p><strong>Current Balance:</strong> {balance} ETH</p>
      )}
    </div>
  );
};

export default ContractBalance;
