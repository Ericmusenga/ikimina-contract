// // import React, { useState, useEffect } from "react";
// import { useContract } from "../utils/contract";
// import { parseEther } from "ethers";
// import { useWeb3 } from "../context/Web3Context";

// const Contribute = () => {
//     const { getContract } = useContract();
//     const { walletAddress, isConnected } = useWeb3();
//     const [roundId, setRoundId] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [contributionAmount, setContributionAmount] = useState("0");
//     const [roundDetails, setRoundDetails] = useState(null);
//     const [error, setError] = useState("");

//     // Fetch member's contribution amount when wallet connects
//     useEffect(() => {
//         const fetchMemberDetails = async () => {
//             if (!isConnected || !walletAddress) return;
            
//             try {
//                 const contract = await getContract();
//                 const member = await contract.members(walletAddress);
//                 setContributionAmount(member.contributionAmount.toString());
//             } catch (err) {
//                 console.error("Failed to fetch member details:", err);
//                 setError("Failed to load your membership details");
//             }
//         };

//         fetchMemberDetails();
//     }, [isConnected, walletAddress, getContract]);

//     // Fetch round details when roundId changes
//     useEffect(() => {
//         const fetchRoundDetails = async () => {
//             if (!roundId || !isConnected) return;
            
//             try {
//                 const contract = await getContract();
//                 const round = await contract.rounds(roundId);
//                 setRoundDetails({
//                     isActive: round.isActive,
//                     targetAmount: round.targetAmount.toString(),
//                     totalContributions: round.totalContributions.toString(),
//                     deadline: new Date(round.deadline.toNumber() * 1000)
//                 });
//                 setError("");
//             } catch (err) {
//                 console.error("Failed to fetch round details:", err);
//                 setError("Invalid round ID or network error");
//                 setRoundDetails(null);
//             }
//         };

//         fetchRoundDetails();
//     }, [roundId, isConnected, getContract]);

//     const contribute = async () => {
//         if (!roundId) {
//             setError("Please enter the round ID.");
//             return;
//         }

//         if (!isConnected) {
//             setError("Please connect your wallet first.");
//             return;
//         }

//         if (contributionAmount === "0") {
//             setError("You are not registered or your contribution amount is 0.");
//             return;
//         }

//         if (roundDetails && !roundDetails.isActive) {
//             setError("This round is no longer active.");
//             return;
//         }

//         setLoading(true);
//         setError("");
        
//         try {
//             const contract = await getContract();
//             const valueInWei = parseEther(contributionAmount);

//             const tx = await contract.contribute(roundId, { value: valueInWei });
//             await tx.wait();

//             // Refresh data after successful contribution
//             const updatedMember = await contract.members(walletAddress);
//             setContributionAmount(updatedMember.contributionAmount.toString());
            
//             const updatedRound = await contract.rounds(roundId);
//             setRoundDetails({
//                 ...roundDetails,
//                 totalContributions: updatedRound.totalContributions.toString()
//             });

//             alert(`✅ Successfully contributed ${contributionAmount} ETH to round ${roundId}`);
//             setRoundId("");
//         } catch (err) {
//             console.error("Contribution error:", err);
//             setError(err.reason || "Contribution failed. See console for details.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="card shadow-sm p-4 mb-4">
//             <h4 className="card-title text-primary mb-3">Make Contribution</h4>
            
//             {!isConnected ? (
//                 <div className="alert alert-warning">
//                     Please connect your wallet to contribute
//                 </div>
//             ) : (
//                 <>
//                     <div className="mb-3">
//                         <label className="form-label">Your Contribution Amount (ETH)</label>
//                         <input 
//                             type="text" 
//                             className="form-control" 
//                             value={contributionAmount} 
//                             readOnly 
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="form-label">Round ID</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Enter Round ID"
//                             value={roundId}
//                             onChange={(e) => setRoundId(e.target.value)}
//                         />
//                     </div>

//                     {roundDetails && (
//                         <div className="card bg-light p-3 mb-3">
//                             <h6>Round #{roundId} Details</h6>
//                             <ul className="list-unstyled">
//                                 <li>Status: {roundDetails.isActive ? "Active" : "Closed"}</li>
//                                 <li>Target: {roundDetails.targetAmount} ETH</li>
//                                 <li>Current: {roundDetails.totalContributions} ETH</li>
//                                 <li>Deadline: {roundDetails.deadline.toLocaleString()}</li>
//                             </ul>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="alert alert-danger mb-3">
//                             {error}
//                         </div>
//                     )}

//                     <button 
//                         className="btn btn-primary w-100" 
//                         onClick={contribute} 
//                         disabled={loading || !isConnected || contributionAmount === "0"}
//                     >
//                         {loading ? (
//                             <>
//                                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                 Contributing...
//                             </>
//                         ) : (
//                             "Contribute"
//                         )}
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Contribute;



// import React, { useState, useEffect } from "react";
// import { useContract } from "../utils/contract";
// import { parseEther } from "ethers";
// import { useWeb3 } from "../context/Web3Context";

// const Contribute = () => {
//     const { getContract } = useContract();
//     const { walletAddress, isConnected } = useWeb3();
//     const [roundId, setRoundId] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [contributionAmount, setContributionAmount] = useState("0");
//     const [roundDetails, setRoundDetails] = useState(null);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchMemberDetails = async () => {
//             if (!isConnected || !walletAddress) return;
//             try {
//                 const contract = await getContract();
//                 const member = await contract.members(walletAddress);
//                 setContributionAmount(member.contributionAmount.toString());
//             } catch (err) {
//                 console.error("Failed to fetch member details:", err);
//                 setError("Failed to load your membership details");
//             }
//         };

//         fetchMemberDetails();
//     }, [isConnected, walletAddress, getContract]);

//     useEffect(() => {
//         const fetchRoundDetails = async () => {
//             if (!roundId || !isConnected) return;
//             try {
//                 const contract = await getContract();
//                 const round = await contract.rounds(roundId);
//                 setRoundDetails({
//                     isActive: round.isActive,
//                     targetAmount: round.targetAmount.toString(),
//                     totalContributions: round.totalContributions.toString(),
//                     deadline: new Date(round.deadline.toNumber() * 1000),
//                 });
//                 setError("");
//             } catch (err) {
//                 console.error("Failed to fetch round details:", err);
//                 setError("Invalid round ID or network error");
//                 setRoundDetails(null);
//             }
//         };

//         fetchRoundDetails();
//     }, [roundId, isConnected, getContract]);

//     const contribute = async () => {
//         if (!roundId) {
//             setError("Please enter the round ID.");
//             return;
//         }

//         if (!isConnected) {
//             setError("Please connect your wallet first.");
//             return;
//         }

//         if (contributionAmount === "0") {
//             setError("You are not registered or your contribution amount is 0.");
//             return;
//         }

//         if (roundDetails && !roundDetails.isActive) {
//             setError("This round is no longer active.");
//             return;
//         }

//         setLoading(true);
//         setError("");

//         try {
//             const contract = await getContract();
//             const valueInWei = parseEther(contributionAmount);
//             const tx = await contract.contribute(roundId, { value: valueInWei });
//             await tx.wait();

//             const updatedMember = await contract.members(walletAddress);
//             setContributionAmount(updatedMember.contributionAmount.toString());

//             const updatedRound = await contract.rounds(roundId);
//             setRoundDetails({
//                 ...roundDetails,
//                 totalContributions: updatedRound.totalContributions.toString(),
//             });

//             alert(`✅ Successfully contributed ${contributionAmount} ETH to round ${roundId}`);
//             setRoundId("");
//         } catch (err) {
//             console.error("Contribution error:", err);
//             setError(err.reason || "Contribution failed. See console for details.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="card shadow-sm p-4 mb-4">
//             <h4 className="card-title text-primary mb-3">Make Contribution</h4>

//             {!isConnected ? (
//                 <div className="alert alert-warning">
//                     Please connect your wallet to contribute
//                 </div>
//             ) : (
//                 <>
//                     <div className="mb-3">
//                         <label className="form-label">Your Contribution Amount (ETH)</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             value={contributionAmount}
//                             readOnly
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="form-label">Round ID</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Enter Round ID"
//                             value={roundId}
//                             onChange={(e) => setRoundId(e.target.value)}
//                         />
//                     </div>

//                     {roundDetails && (
//                         <div className="card bg-light p-3 mb-3">
//                             <h6>Round #{roundId} Details</h6>
//                             <ul className="list-unstyled">
//                                 <li>Status: {roundDetails.isActive ? "Active" : "Closed"}</li>
//                                 <li>Target: {roundDetails.targetAmount} ETH</li>
//                                 <li>Current: {roundDetails.totalContributions} ETH</li>
//                                 <li>Deadline: {roundDetails.deadline.toLocaleString()}</li>
//                             </ul>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="alert alert-danger mb-3">
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         className="btn btn-primary w-100"
//                         onClick={contribute}
//                         disabled={loading || !isConnected || contributionAmount === "0"}
//                     >
//                         {loading ? (
//                             <>
//                                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                 Contributing...
//                             </>
//                         ) : (
//                             "Contribute"
//                         )}
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Contribute;



import React, { useState, useEffect } from "react";
import { useContract } from "../utils/contract";
import { parseEther, formatEther } from "ethers";
import { useWeb3 } from "../context/Web3Context";

const Contribute = () => {
  const { getContract } = useContract();
  const { walletAddress, isConnected } = useWeb3();

  const [roundId, setRoundId] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("0");
  const [roundDetails, setRoundDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!isConnected || !walletAddress) return;

      try {
        const contract = await getContract();
        const member = await contract.members(walletAddress);
        setContributionAmount(formatEther(member.contributionAmount));
      } catch (err) {
        console.error("Failed to fetch member details:", err);
        setError("⚠️ Unable to load your contribution amount.");
      }
    };

    fetchMemberDetails();
  }, [isConnected, walletAddress, getContract]);

  useEffect(() => {
    const fetchRoundDetails = async () => {
      if (!roundId || !isConnected) return;

      try {
        const contract = await getContract();
        const round = await contract.rounds(roundId);

        setRoundDetails({
          isActive: round.isActive,
          targetAmount: formatEther(round.targetAmount),
          totalContributions: formatEther(round.totalContributions),
          deadline: new Date(Number(round.deadline) * 1000),
        });

        setError("");
      } catch (err) {
        console.error("Failed to fetch round details:", err);
        setError("❌ Invalid round ID or network issue.");
        setRoundDetails(null);
      }
    };

    fetchRoundDetails();
  }, [roundId, isConnected, getContract]);

  const contribute = async () => {
    if (!roundId) return setError("⚠️ Enter a valid Round ID.");
    if (!isConnected) return setError("⚠️ Connect your wallet.");
    if (contributionAmount === "0") return setError("❌ Your contribution amount is 0.");
    if (roundDetails && !roundDetails.isActive) return setError("❌ This round is no longer active.");

    setLoading(true);
    setError("");

    try {
      const contract = await getContract();
      const valueInWei = parseEther(contributionAmount);

      const tx = await contract.contribute(roundId, { value: valueInWei });
      await tx.wait();

      const updatedMember = await contract.members(walletAddress);
      setContributionAmount(formatEther(updatedMember.contributionAmount));

      const updatedRound = await contract.rounds(roundId);
      setRoundDetails({
        ...roundDetails,
        totalContributions: formatEther(updatedRound.totalContributions),
      });

      alert(`✅ You contributed ${contributionAmount} ETH to Round ${roundId}`);
      setRoundId("");
    } catch (err) {
      console.error("Contribution error:", err);
      setError(err.reason || "❌ Transaction failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h4 className="card-title text-primary mb-3">Make a Contribution</h4>

      {!isConnected ? (
        <div className="alert alert-warning">🔌 Please connect your wallet first.</div>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">Your Contribution Amount (ETH)</label>
            <input type="text" className="form-control" value={contributionAmount} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Round ID</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Round ID"
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
            />
          </div>

          {roundDetails && (
            <div className="card bg-light p-3 mb-3">
              <h6 className="fw-bold">Round #{roundId} Details</h6>
              <ul className="list-unstyled mb-0">
                <li>Status: {roundDetails.isActive ? "✅ Active" : "⛔ Closed"}</li>
                <li>Target: {roundDetails.targetAmount} ETH</li>
                <li>Current: {roundDetails.totalContributions} ETH</li>
                <li>Deadline: {roundDetails.deadline.toLocaleString()}</li>
              </ul>
            </div>
          )}

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <button
            className="btn btn-primary w-100"
            onClick={contribute}
            disabled={loading || !isConnected || contributionAmount === "0"}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Contributing...
              </>
            ) : (
              "Contribute"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default Contribute;
