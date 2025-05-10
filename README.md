
https://www.youtube.com/watch?v=tOyJn3iupxY ,(Video Link),

https://github.com/Ericmusenga/ikimina-contract.git,(Github Link)
![image](https://github.com/user-attachments/assets/215d0820-489f-4858-b109-da116de99424),(interface)



## IkiminaSystem Smart Contract

The "IkiminaSystem" is a decentralized savings group (Ikimina) smart contract built on Ethereum using Solidity. It enables member registration, verification, contributions, payout distribution, and admin-controlled rounds of savings.

## Smart Contract Overview

## Features

- Member Registration**: Users can register with full name, phone number, and contribution amount.
- Member Verification**: Admins verify members before they can participate.
- Savings Rounds**: Admins initiate savings rounds, and verified members contribute.
- Payouts**: Admins issue a payout to a selected verified member after a round.
- Admin Management**: The manager can assign new admins.

---

 ## Access Control

- `manager`: The contract deployer and main administrator.
- `isAdmin`: Mapping of admin addresses with special privileges.
- Only verified members can contribute.
- Only admins can verify members, start rounds, and issue payouts.

---

## Smart Contract Structure

## Structs

## Member: `fullName`, `phoneNumber`, `contributionAmount`, `isVerified`, `hasReceivedPayout`
- **Round**: `roundId`, `description`, `totalContribution`, `isActive`
- **Payout**: `roundId`, `memberAddress`, `isPaid`

### Key Mappings

- `members`: Maps address to `Member`
- `rounds`: Maps round ID to `Round`
- `payouts`: Maps address to `Payout`

---

## Main Functions

| Function | Description |
|---------|-------------|
| `registerMember()` | Register a new member with full details |
| `verifyMember()` | Admin verifies a member to participate |
| `startRound()` | Admin starts a new savings round |
| `contribute()` | Verified member sends ETH to contribute |
| `issuePayout()` | Admin pays out the total pool to one member |
| `addAdmin()` | Add a new admin |
| `viewMember()` | Get details of a member |
| `viewRound()` | View a round’s details |
| `getRegisteredMembers()` | Get all registered members |
| `getContractBalance()` | View total balance in the contract |

---

##  Events

- `MemberRegistered(address, string)`
- `MemberVerified(address)`
- `RoundStarted(uint, string)`
- `ContributionMade(uint, address, uint)`
- `PayoutIssued(uint, address)`
- `AdminAdded(address)`

---

##  Deployment

This contract is compatible with [Hardhat](https://hardhat.org/) and can be deployed using a deployment script like:

```js
const hre = require("hardhat");

async function main() {
  const Ikimina = await hre.ethers.getContractFactory("IkiminaSystem");
  const ikimina = await Ikimina.deploy();
  await ikimina.deployed();
  console.log("IkiminaSystem deployed to:", ikimina.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
