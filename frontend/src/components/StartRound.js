import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const contractABI = [
  {
    inputs: [{ internalType: "string", name: "_description", type: "string" }],
    name: "startRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const StartRound = () => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const startRound = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask!");
      return;
    }

    if (!description.trim()) {
      setStatus("Description cannot be empty.");
      return;
    }

    try {
      setStatus("Connecting to MetaMask...");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(contractAddress, contractABI, signer);

      setStatus("Sending transaction...");
      const tx = await contract.startRound(description);
      await tx.wait();

      setStatus("🎉 Round started successfully!");
      setDescription("");
    } catch (error) {
      console.error("Error starting round:", error);
      setStatus("❌ Error: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Start New Round</h2>
      <input
        type="text"
        placeholder="Enter round description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={startRound} style={{ padding: "10px 20px" }}>Start Round</button>
      <p>{status}</p>
    </div>
  );
};

export default StartRound;
