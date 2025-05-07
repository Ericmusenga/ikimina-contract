import React from 'react';
import { ethers } from "ethers";
// import contractABI from "./EHiringSystem.json";

import contractABI from "./IkiminaSystem.json";  // ✅ Use IkiminaSystem ABI

import { useWeb3 } from "../context/Web3Context";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

export function useContract() {
    const { provider, isConnected } = useWeb3();

    const getContract = async() => {
        if (!isConnected || !provider) {
            throw new Error("Please connect to MetaMask first");
        }

        try {
            const signer = await provider.getSigner();
            return new ethers.Contract(contractAddress, contractABI.abi, signer);
        } catch (error) {
            console.error("Error initializing contract:", error);
            throw error;
        }
    };

    return { getContract };
}