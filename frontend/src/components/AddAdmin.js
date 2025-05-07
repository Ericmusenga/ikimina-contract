import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractFile from "../utils/IkiminaSystem.json";

const contractABI = contractFile.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual deployed address

const AllMembers = () => {
  const [members, setMembers] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadMembers = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        try {
          const memberAddresses = await contractInstance.methods.getRegisteredMembers().call();

          const memberData = await Promise.all(
            memberAddresses.map(async (addr) => {
              const details = await contractInstance.methods.viewMember(addr).call();
              const isAdmin = await contractInstance.methods.isAdmin(addr).call();
              return {
                address: addr,
                fullName: details[0],
                phoneNumber: details[1],
                contributionAmount: web3.utils.fromWei(details[2], "ether"),
                isVerified: details[3],
                hasReceivedPayout: details[4],
                isAdmin: isAdmin
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

  const makeAdmin = async (address) => {
    try {
      await contract.methods.addAdmin(address).send({ from: account });
      alert(`Admin privileges granted to: ${address}`);
      // Reload members to update admin status
      window.location.reload();
    } catch (error) {
      console.error("Error making admin:", error);
      alert("Failed to add admin. Check permissions acd I d wallet.");
    }
  };

  return (
    <div>
      <h2>Members Which are Not Admin</h2>
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
              <strong>Admin:</strong> {member.isAdmin ? "Yes" : "No"}<br />
              <strong>Address:</strong> {member.address}<br />
              {!member.isAdmin && (
                <button onClick={() => makeAdmin(member.address)}>Make Admin</button>
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
