import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Define the ABI directly
const contractABI = [
    {
        inputs: [
            { internalType: "uint", name: "_roundId", type: "uint" },
            { internalType: "address payable", name: "_memberAddress", type: "address" }
        ],
        name: "issuePayout",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

const IssuePayout = () => {
    const [roundId, setRoundId] = useState("");
    const [memberAddress, setMemberAddress] = useState("");
    const [status, setStatus] = useState("");

    const issuePayout = async () => {
        if (!window.ethereum) {
            setStatus("Please install MetaMask!");
            return;
        }

        if (!roundId || !memberAddress) {
            setStatus("Round ID and Member Address are required.");
            return;
        }

        try {
            setStatus("Connecting to MetaMask...");

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Using the direct ABI array
            const contract = new Contract(contractAddress, contractABI, signer);

            setStatus("Sending transaction...");
            const tx = await contract.issuePayout(roundId, memberAddress);
            await tx.wait();

            setStatus("🎉 Payout issued successfully!");
            setRoundId("");
            setMemberAddress("");
        } catch (error) {
            console.error("Error issuing payout:", error);
            setStatus("❌ Error: " + error.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Issue Payout</h2>
            <input
                type="number"
                placeholder="Enter Round ID"
                value={roundId}
                onChange={(e) => setRoundId(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
                type="text"
                placeholder="Enter Member Address"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button onClick={issuePayout} style={{ padding: "10px 20px" }}>Issue Payout</button>
            <p>{status}</p>
        </div>
    );
};

export default IssuePayout;