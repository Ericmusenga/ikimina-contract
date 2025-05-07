import React, { useState } from "react";
import { useContract } from "../utils/contract";

const RegisterMember = () => {
    const { getContract } = useContract();
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        contributionAmount: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const register = async () => {
        const { fullName, phoneNumber, contributionAmount } = form;

        if (!fullName || !phoneNumber || !contributionAmount) {
            alert("Please fill out all fields.");
            return;
        }

        setLoading(true);
        try {
            const contract = await getContract();
            const tx = await contract.registerMember(
                fullName,
                phoneNumber,
                parseInt(contributionAmount) // it expects uint in contract
            );
            await tx.wait();

            alert("✅ Member registered successfully.");
            setForm({ fullName: "", phoneNumber: "", contributionAmount: "" });
        } catch (err) {
            console.error(err);
            alert("❌ Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm p-4 mb-4">
            <h4 className="card-title text-primary mb-3">Register Member</h4>

            <input
                type="text"
                className="form-control mb-3"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
            />
            <input
                type="text"
                className="form-control mb-3"
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
            />
            <input
                type="number"
                className="form-control mb-3"
                name="contributionAmount"
                placeholder="Contribution Amount (in ETH)"
                value={form.contributionAmount}
                onChange={handleChange}
            />

            <button className="btn btn-success w-100" onClick={register} disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    );
};

export default RegisterMember;
