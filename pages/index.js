import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionMessage, setTransactionMessage] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [etherPrice, setEtherPrice] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [balanceInUSD, setBalanceInUSD] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Connected Account: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("Please install MetaMask to continue.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts[0]);
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceWei = await atm.getBalance();
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEther));
    }
  };

  const handleTransaction = async (action) => {
    if (!transactionAmount) {
      alert("Please enter an amount.");
      return;
    }

    if (atm) {
      try {
        let tx;
        if (action === "deposit") {
          tx = await atm.deposit(ethers.utils.parseEther(transactionAmount));
        } else if (action === "depositWithMessage") {
          tx = await atm.depositWithMessage(
            ethers.utils.parseEther(transactionAmount),
            transactionMessage
          );
        } else if (action === "withdraw") {
          tx = await atm.withdraw(ethers.utils.parseEther(transactionAmount));
        } else if (action === "withdrawToAddress") {
          tx = await atm.withdrawToAddress(
            ethers.utils.parseEther(transactionAmount),
            withdrawAddress
          );
        }
        await tx.wait();
        setTransactionAmount("");
        setTransactionMessage("");
        setWithdrawAddress("");
        getBalance();
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  const handleOwnershipTransfer = async () => {
    if (!withdrawAddress) {
      alert("Please enter a new owner's address.");
      return;
    }

    if (atm) {
      try {
        const tx = await atm.transferOwnership(withdrawAddress);
        await tx.wait();
        setWithdrawAddress("");
      } catch (error) {
        console.error("Ownership transfer failed:", error);
      }
    }
  };

  const fetchEtherPrice = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      const price = data.ethereum.usd;
      setEtherPrice(price);
    } catch (error) {
      console.error("Failed to fetch Ether price:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertBalanceToUSD = () => {
    if (balance && etherPrice) {
      setBalanceInUSD(balance * etherPrice);
    }
  };

  const renderUserInterface = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this DApp.</p>;
    }

    if (!account) {
      return (
        <button
          onClick={connectAccount}
          className="action-button"
        >
          Connect MetaMask Wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Account: {account}</p>
        <p>Balance: {balance} ETH</p>
        <input
          type="number"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          placeholder="Enter amount in ETH"
          className="input-field"
        />
        <br />
        <input
          type="text"
          value={transactionMessage}
          onChange={(e) => setTransactionMessage(e.target.value)}
          placeholder="Enter message (optional)"
          className="input-field"
        />
        <br />
        <input
          type="text"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value)}
          placeholder="Enter address (for withdraw/transfer)"
          className="input-field"
        />
        <br />
        <div className="button-group">
          <button
            onClick={() => handleTransaction("deposit")}
            className="action-button"
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransaction("depositWithMessage")}
            className="action-button"
          >
            Deposit with Message
          </button>
          <button
            onClick={() => handleTransaction("withdraw")}
            className="action-button"
          >
            Withdraw
          </button>
          <button
            onClick={() => handleTransaction("withdrawToAddress")}
            className="action-button"
          >
            Withdraw to Address
          </button>
          <button
            onClick={handleOwnershipTransfer}
            className="action-button"
          >
            Transfer Ownership
          </button>
          <button
            onClick={fetchEtherPrice}
            disabled={loading}
            className="action-button"
          >
            {loading ? "Loading..." : "Get Current Ether Price"}
          </button>
          <button
            onClick={convertBalanceToUSD}
            className="action-button"
          >
            Balance in USD
          </button>
        </div>
        {etherPrice && <p>Current Ether Price: ${etherPrice}</p>}
        {balanceInUSD && <p>Balance in USD: ${balanceInUSD}</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to My Crypto Wallet!</h1>
      </header>
      {renderUserInterface()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #292c35;
          color: white;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        h1 {
          margin-bottom: 20px;
          color: #3ccfcf;
        }
        .input-field {
          border-radius: 8px;
          padding: 10px;
          font-size: 16px;
          margin: 10px 0;
          width: 80%;
          max-width: 300px;
          border: 2px solid #3ccfcf;
          background-color: #1f2128;
          color: white;
        }
        .button-group {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .action-button {
          background: #3ccfcf;
          color: black;
          border-radius: 8px;
          height: 40px;
          border: 2px solid white;
          cursor: pointer;
          padding: 0 20px;
          font-size: 16px;
          transition: background 0.3s, transform 0.3s;
        }
        .action-button:hover {
          background: #18a5a5;
          transform: scale(1.05);
        }
        .action-button:active {
          transform: scale(1);
        }
      `}</style>
    </main>
  );
}
