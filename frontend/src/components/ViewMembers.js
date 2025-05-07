import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractFile from "../utils/IkiminaSystem.json";

const contractABI = contractFile.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Replace with actual deployed address

const AllMembers = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadMembers = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Ask user to connect wallet

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        try {
          const memberAddresses = await contract.methods.getRegisteredMembers().call();

          const memberData = await Promise.all(
            memberAddresses.map(async (addr) => {
              const details = await contract.methods.viewMember(addr).call();
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

    loadMembers();
  }, []);

  return (
    <div>
      <h2>All Registered Members</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((member, index) => (
            <li key={index}>
              <strong>Name:</strong> {member.fullName}<br />
              <strong>Phone Number:</strong> {member.phoneNumber}<br />
              <strong>Contribution Amount:</strong> {member.contributionAmount} ETH<br />
              <strong>Verified:</strong> {member.isVerified ? "Yes is verified" : "Not Yet Done"}<br />
              <strong>Received Payout:</strong> {member.hasReceivedPayout ? "Yes has received" : "Not Yet Done"}<br />
              <strong>Address:</strong> {member.address}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllMembers;
