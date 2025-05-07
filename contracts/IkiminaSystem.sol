// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IkiminaSystem {

    address public manager;

    constructor() {
        manager = msg.sender;
        isAdmin[manager] = true; // Manager is also an admin by default
    }

    // Admin mapping
    mapping(address => bool) public isAdmin;

    // Member structure
    struct Member {
        string fullName;
        string phoneNumber;
        uint contributionAmount; // Contribution amount in Ether
        bool isVerified;
        bool hasReceivedPayout;
    }

    struct Round {
        uint roundId;
        string description;
        uint totalContribution; // In Wei
        bool isActive;
    }

    struct Payout {
        uint roundId;
        address memberAddress;
        bool isPaid;
    }

    mapping(address => Member) public members;
    mapping(uint => Round) public rounds;
    mapping(address => Payout) public payouts;

    address[] public registeredMembers;
    uint public nextRoundId = 1;

    event MemberRegistered(address memberAddress, string fullName);
    event MemberVerified(address memberAddress);
    event RoundStarted(uint roundId, string description);
    event ContributionMade(uint roundId, address memberAddress, uint amount);
    event PayoutIssued(uint roundId, address memberAddress);
    event AdminAdded(address newAdmin);

    // Modifiers
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    modifier onlyVerifiedMember() {
        require(members[msg.sender].isVerified, "Only verified members can perform this action");
        _;
    }

    // Add a new admin (accessible to anyone)
    function addAdmin(address _newAdmin) public {
        require(_newAdmin != address(0), "Invalid address");
        isAdmin[_newAdmin] = true;
        emit AdminAdded(_newAdmin);
    }

    // Register member
    function registerMember(
        string memory _fullName,
        string memory _phoneNumber,
        uint _contributionAmount
    ) public {
        require(bytes(_fullName).length > 0, "Full name is required");
        require(bytes(_phoneNumber).length > 0, "Phone number is required");
        require(_contributionAmount > 0, "Contribution must be greater than 0");
        require(bytes(members[msg.sender].fullName).length == 0, "Already registered");

        members[msg.sender] = Member({
            fullName: _fullName,
            phoneNumber: _phoneNumber,
            contributionAmount: _contributionAmount,
            isVerified: false,
            hasReceivedPayout: false
        });

        registeredMembers.push(msg.sender);
        emit MemberRegistered(msg.sender, _fullName);
    }

    // Verify member
    function verifyMember(address _memberAddress) public onlyAdmin {
        require(bytes(members[_memberAddress].fullName).length != 0, "Member not found");
        members[_memberAddress].isVerified = true;
        emit MemberVerified(_memberAddress);
    }

    // Start new round
    function startRound(string memory _description) public onlyAdmin {
        rounds[nextRoundId] = Round({
            roundId: nextRoundId,
            description: _description,
            totalContribution: 0,
            isActive: true
        });

        emit RoundStarted(nextRoundId, _description);
        nextRoundId++;
    }

    // Contribute
    function contribute(uint _roundId) public payable onlyVerifiedMember {
        require(rounds[_roundId].isActive, "Round not active");

        uint contributionInWei = members[msg.sender].contributionAmount * 1 ether;
        require(msg.value == contributionInWei, "Incorrect contribution amount");

        rounds[_roundId].totalContribution += msg.value;
        emit ContributionMade(_roundId, msg.sender, msg.value);
    }

    // Issue payout
    function issuePayout(uint _roundId, address payable _memberAddress) public onlyAdmin {
        require(rounds[_roundId].isActive, "Round not active");
        require(members[_memberAddress].isVerified, "Member not verified");
        require(!members[_memberAddress].hasReceivedPayout, "Already received payout");

        payouts[_memberAddress] = Payout({
            roundId: _roundId,
            memberAddress: _memberAddress,
            isPaid: true
        });

        uint payoutAmountInWei = rounds[_roundId].totalContribution;
        require(address(this).balance >= payoutAmountInWei, "Not enough contract balance");

        _memberAddress.transfer(payoutAmountInWei);
        members[_memberAddress].hasReceivedPayout = true;
        rounds[_roundId].isActive = false;

        emit PayoutIssued(_roundId, _memberAddress);
    }

    // View member
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

    // View round
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

    function getRegisteredMembers() public view returns (address[] memory) {
        return registeredMembers;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
