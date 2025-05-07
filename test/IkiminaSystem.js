const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IkiminaSystem", function () {
  let ikimina;
  let manager;
  let member1, member2;

  beforeEach(async function () {
    [manager, member1, member2] = await ethers.getSigners();

    const IkiminaSystem = await ethers.getContractFactory("IkiminaSystem");
    ikimina = await IkiminaSystem.deploy();
    await ikimina.deployed();
  });

  it("should register and verify a member", async function () {
    await ikimina.connect(member1).registerMember("Alice", "0788000000", 1);

    let memberData = await ikimina.viewMember(member1.address);
    expect(memberData[0]).to.equal("Alice");
    expect(memberData[3]).to.equal(false); // isVerified

    await ikimina.verifyMember(member1.address);
    memberData = await ikimina.viewMember(member1.address);
    expect(memberData[3]).to.equal(true); // isVerified
  });

  it("should start a round and accept a contribution", async function () {
    await ikimina.connect(member1).registerMember("Alice", "0788000000", 1);
    await ikimina.verifyMember(member1.address);

    await ikimina.startRound("First Saving Round");

    await ikimina.connect(member1).contribute(1, {
      value: ethers.utils.parseEther("1"),
    });

    const round = await ikimina.viewRound(1);
    expect(round[1]).to.equal(ethers.utils.parseEther("1")); // totalContribution
  });

  it("should issue a payout to a member", async function () {
    await ikimina.connect(member1).registerMember("Alice", "0788000000", 1);
    await ikimina.verifyMember(member1.address);

    await ikimina.startRound("Payout Test");
    await ikimina.connect(member1).contribute(1, {
      value: ethers.utils.parseEther("1"),
    });

    const initialBalance = await ethers.provider.getBalance(member1.address);

    const tx = await ikimina.issuePayout(1, member1.address);
    await tx.wait();

    const updatedMember = await ikimina.viewMember(member1.address);
    expect(updatedMember[4]).to.equal(true); // hasReceivedPayout
  });
});
