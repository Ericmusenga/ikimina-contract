import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractFile from "../utils/IkiminaSystem.json";

const contractABI = contractFile.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Update as needed

const AllMembers = () => {
  const [members, setMembers] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const ikiminaContract = new web3.eth.Contract(contractABI, contractAddress);
        setContract(ikiminaContract);

        try {
          const memberAddresses = await ikiminaContract.methods.getRegisteredMembers().call();

          const memberData = await Promise.all(
            memberAddresses.map(async (addr) => {
              const details = await ikiminaContract.methods.viewMember(addr).call();
              return {
                address: addr,
                fullName: details[0],
                phoneNumber: details[1],
                contributionAmount: web3.utils.fromWei(details[2], "ether"),
                isVerified: details[3],
                hasReceivedPayout: details[4]
              };
            })
          );

          setMembers(memberData);
        } catch (err) {
          console.error("Error loading members:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    loadBlockchainData();
  }, []);

  // ✅ Function to verify a member
  const verifyMember = async (memberAddress) => {
    if (contract && account) {
      try {
        await contract.methods.verifyMember(memberAddress).send({ from: account });
        alert(`Verified member: ${memberAddress}`);
        window.location.reload(); // Refresh to reflect changes
      } catch (err) {
        console.error("Verification failed:", err);
        alert("Verification failed. Make sure you're an admin.");
      }
    }
  };

  return (
    <div>
      <h2>Members Not Verified</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((member, index) => (
            <li key={index}>
              <strong>Name:</strong> {member.fullName}<br />
              <strong>Phone Number:</strong> {member.phoneNumber}<br />
              <strong>Contribution Amount:</strong> {member.contributionAmount} ETH<br />
              <strong>Verified:</strong> {member.isVerified ? "✅ Yes" : "❌ Not Yet"}<br />
              <strong>Received Payout:</strong> {member.hasReceivedPayout ? "✅ Yes" : "❌ No"}<br />
              <strong>Address:</strong> {member.address}<br />
              
              {!member.isVerified && (
                <button onClick={() => verifyMember(member.address)}>
                  Verify Member
                </button>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllMembers;
