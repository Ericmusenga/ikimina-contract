// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IkiminaSystem {

    address public manager;

    constructor() {
        manager = msg.sender;
    }

    // Member structure
    struct Member {
        string fullName;
        string phoneNumber;
        uint contributionAmount; // Contribution amount in Ether
        bool isVerified;
        bool hasReceivedPayout; // New field to check if member received payout
    }

    // Contribution Round structure
    struct Round {
        uint roundId;
        string description;
        uint totalContribution; // Total contribution in Wei
        bool isActive;
    }

    // Payout structure
    struct Payout {
        uint roundId;
        address memberAddress;
        bool isPaid;
    }

    mapping(address => Member) public members;
    mapping(uint => Round) public rounds;
    mapping(address => Payout) public payouts;

    uint public nextRoundId = 1;

    event MemberRegistered(address memberAddress, string fullName);
    event MemberVerified(address memberAddress);
    event RoundStarted(uint roundId, string description);
    event ContributionMade(uint roundId, address memberAddress, uint amount);
    event PayoutIssued(uint roundId, address memberAddress);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }

    modifier onlyVerifiedMember() {
        require(members[msg.sender].isVerified, "Only verified members can perform this action");
        _;
    }

    // Member Registration
    function registerMember(
        string memory _fullName,
        string memory _phoneNumber,
        uint _contributionAmount
    ) public {
        require(bytes(members[msg.sender].fullName).length == 0, "Already registered");

        members[msg.sender] = Member({
            fullName: _fullName,
            phoneNumber: _phoneNumber,
            contributionAmount: _contributionAmount, // Contribution amount in Ether
            isVerified: false,
            hasReceivedPayout: false
        });

        emit MemberRegistered(msg.sender, _fullName);
    }

    // Manager Verifies Member
    function verifyMember(address _memberAddress) public onlyManager {
        require(bytes(members[_memberAddress].fullName).length != 0, "Member not found");
        members[_memberAddress].isVerified = true;

        emit MemberVerified(_memberAddress);
    }

    // Manager starts new saving round
    function startRound(string memory _description) public onlyManager {
        rounds[nextRoundId] = Round({
            roundId: nextRoundId,
            description: _description,
            totalContribution: 0,
            isActive: true
        });

        emit RoundStarted(nextRoundId, _description);
        nextRoundId++;
    }

    // Verified Member contributes
    function contribute(uint _roundId) public payable onlyVerifiedMember {
        require(rounds[_roundId].isActive, "Round not active");
        
        uint contributionInWei = members[msg.sender].contributionAmount * 1 ether;  // Convert Ether to Wei
        require(msg.value == contributionInWei, "Incorrect contribution amount");

        rounds[_roundId].totalContribution += msg.value;

        emit ContributionMade(_roundId, msg.sender, msg.value);
    }

    // Manager issues payout to a member
    function issuePayout(uint _roundId, address payable _memberAddress) public onlyManager {
        require(rounds[_roundId].isActive, "Round not active");
        require(members[_memberAddress].isVerified, "Member not verified");
        require(!members[_memberAddress].hasReceivedPayout, "Already received payout");

        payouts[_memberAddress] = Payout({
            roundId: _roundId,
            memberAddress: _memberAddress,
            isPaid: true
        });

        uint payoutAmountInWei = rounds[_roundId].totalContribution;  // Total contribution in Wei
        require(address(this).balance >= payoutAmountInWei, "Not enough balance in contract");

        // Transfer the payout in Wei
        _memberAddress.transfer(payoutAmountInWei);

        members[_memberAddress].hasReceivedPayout = true;

        rounds[_roundId].isActive = false; // Close the round after payout

        emit PayoutIssued(_roundId, _memberAddress);
    }

    // View member details
    function viewMember(address _memberAddress) public view returns (
        string memory,
        string memory,
        uint,
        bool,
        bool
    ) {
        Member memory member = members[_memberAddress];
        return (
            member.fullName,
            member.phoneNumber,
            member.contributionAmount,
            member.isVerified,
            member.hasReceivedPayout
        );
    }

    // View round details
    function viewRound(uint _roundId) public view returns (
        string memory,
        uint,
        bool
    ) {
        Round memory round = rounds[_roundId];
        return (
            round.description,
            round.totalContribution,
            round.isActive
        );
    }

    // Get Contract Balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
