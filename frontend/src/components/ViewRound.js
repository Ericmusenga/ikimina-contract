import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractFile from "../utils/IkiminaSystem.json";

const contractABI = contractFile.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Use actual deployed address

const ViewRound = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [roundId, setRoundId] = useState(1); // Default round ID
  const [roundDetails, setRoundDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();

        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

        setWeb3(web3Instance);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    };

    initWeb3();
  }, []);

  const fetchRoundDetails = async () => {
    try {
      if (!contract) return;
      const result = await contract.methods.viewRound(roundId).call();

      setRoundDetails({
        description: result[0],
        totalContribution: web3.utils.fromWei(result[1], "ether"),
        isActive: result[2],
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch round details. Make sure the round ID is valid.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>View Round Details</h2>
      <div>
        <label>Enter Round ID: </label>
        <input
          type="number"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          min="1"
        />
        <button onClick={fetchRoundDetails}>Fetch Round</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {roundDetails && (
        <div>
          <h3>Round #{roundId}</h3>
          <p><strong>Description:</strong> {roundDetails.description}</p>
          <p><strong>Total Contribution:</strong> {roundDetails.totalContribution} ETH</p>
          <p><strong>Status:</strong> {roundDetails.isActive ? "Active" : "Closed"}</p>
        </div>
      )}
    </div>
  );
};

export default ViewRound;
