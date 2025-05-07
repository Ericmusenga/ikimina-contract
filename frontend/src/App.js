import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3Provider } from "./context/Web3Context";

import RegisterMember from "./components/RegisterMember";
import ConnectWallet from "./components/ConnectWallet";
import ViewMembers from "./components/ViewMembers";
import VerifyMember from "./components/verifyMember";
import AddAdmin from "./components/AddAdmin";
import StartRound from "./components/StartRound";
import ViewRound from "./components/ViewRound";
import IssuePayout from "./components/IssuePayout";
import ContractBalance from "./components/ContractBalance";
import Contribute from "./components/Contribute";

// Icons
import { FaWallet, FaUserPlus, FaUsers, FaUserCheck, FaUserShield, FaPlay, FaEye, FaMoneyCheckAlt, FaBalanceScale, FaDonate } from "react-icons/fa";

const componentMap = {
    ConnectWallet: { component: ConnectWallet, label: "Connect Wallet", icon: <FaWallet /> },
    RegisterMember: { component: RegisterMember, label: "Register Member", icon: <FaUserPlus /> },
    AddAdmin: { component: AddAdmin, label: "Add Admin", icon: <FaUserShield /> },
    ViewMembers: { component: ViewMembers, label: "View Members", icon: <FaUsers /> },
    VerifyMember: { component: VerifyMember, label: "Verify Member", icon: <FaUserCheck /> },
    StartRound: { component: StartRound, label: "Start Round", icon: <FaPlay /> },
    ViewRound: { component: ViewRound, label: "View Round", icon: <FaEye /> },
    IssuePayout: { component: IssuePayout, label: "Issue Payout", icon: <FaMoneyCheckAlt /> },
    Contribute: { component: Contribute, label: "Contribute", icon: <FaDonate /> },
    ContractBalance: { component: ContractBalance, label: "Contract Balance", icon: <FaBalanceScale /> },
    
};

function App() {
    const [selected, setSelected] = useState("ConnectWallet");
    const SelectedComponent = componentMap[selected].component;

    return (
        <Web3Provider>
            <div className="container-fluid" style={{ backgroundColor: "#868f9fa", minHeight: "100vh" }}>
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 bg-white border-end vh-100 p-3 shadow-sm">
                        <h4 className="text-danger mb-4">📋 Welcome To The Ikimina System Dashboard</h4>
                        <ul className="nav flex-column">
                            {Object.entries(componentMap).map(([key, { label, icon }]) => (
                                <li key={key} className="nav-item mb-2">
                                    <button
                                        className={`btn btn-outline-danger w-100 text-start ${
                                            selected === key ? "active" : ""
                                        }`}
                                        onClick={() => setSelected(key)}
                                    >
                                        <span className="me-2">{icon}</span> {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 p-4">
                        <div className="card shadow p-4 bg-white">
                            <SelectedComponent />
                        </div>
                    </div>
                </div>
            </div>
        </Web3Provider>
    );
}

export default App;
