# 🧬 MetaMark

### 🔗 Fake Product Identification with Barcode Based on Blockchain Technology

![MetaMark Banner](https://img.shields.io/badge/Build-NextGen%20dApp-blueviolet?style=flat-square) ![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.x-blue.svg) ![React](https://img.shields.io/badge/React-Frontend-61dafb.svg?style=flat&logo=react) ![IPFS](https://img.shields.io/badge/IPFS-Decentralized%20Storage-teal) ![License](https://img.shields.io/github/license/prashik287/MetaMark)

---

## 🌐 Overview

**MetaMark** is a futuristic decentralized application (dApp) that helps detect and prevent **counterfeit products** using **barcode verification powered by blockchain**.

By integrating **Solidity smart contracts**, **React frontend**, and **IPFS storage**, MetaMark ensures that every product’s authaenticity can be verified securely and immutably on the Ethereum blockchain.

---

## 🚀 Features

- 🔐 **Blockchain Security** — Immutable smart contract written in Solidity to validate product authenticity.
- 📦 **Barcode Scanning** — Scan real-world product barcodes to check against blockchain data.
- 🌍 **IPFS Integration** — Secure, decentralized product metadata & ownership proof.
- ⚛️ **React Frontend** — Sleek, responsive, and futuristic UI built with React + Tailwind.
- 🧪 **Fake Product Detection** — Instantly identify counterfeit or tampered products.
- 🔗 **Ownership History** — Product traceability from manufacturer to customer.

---

## 🧱 Tech Stack

| Layer         | Technology                         |
|---------------|-------------------------------------|
| 🌐 Frontend    | React, Tailwind CSS, Vite           |
| 🧠 Smart Contract | Solidity, Hardhat                  |
| 📦 Storage     | IPFS (via Pinata or Web3.Storage)   |
| 🛠 Tools       | MetaMask, Ethers.js, QR/Barcode Scanner |

---
## 🔄 Workflow

1. 🏦 **Manufacturer Registration & Staking**  
   Manufacturers must register by depositing **0.05 ETH**, which is **staked on the blockchain** as a commitment to authenticity.  
   - This stake acts as a security deposit.
   - If a **fraudulent product complaint** is received and verified by the system, the **staked amount will be slashed** (i.e., burned or redistributed).

2. 🏷️ **Product Upload & Metadata Generation**  
   Registered manufacturers upload product details along with a unique barcode.

3. 🔗 **Decentralized Storage via IPFS**  
   Product metadata is hashed and stored on **IPFS** ensuring immutability and censorship-resistance.

4. 📜 **Blockchain Registration**  
   The smart contract stores the barcode and IPFS hash on the Ethereum blockchain, creating a tamper-proof authenticity record.

5. 📱 **Consumer Verification**  
   Customers scan the product’s barcode using the MetaMark dApp.

6. ✅ **Authenticity Check & Slashing Mechanism**  
   - If product data matches the on-chain record → product is verified as **genuine**.  
   - If a customer flags a **fake product**, and the system confirms it → **manufacturer’s deposit is slashed**.

7. 🔁 **Traceability & History**  
   Ownership and movement history can be traced on-chain, enhancing trust and supply chain transparency.


---

## 🧰 Installation

### 🔧 Prerequisites
- Node.js `>=18.x`
- MetaMask Wallet
- IPFS API key (e.g., Pinata)
- Hardhat (`npm install --save-dev hardhat`)
- Solidity Compiler

### 📦 Clone & Setup

```bash
git clone https://github.com/prashik287/MetaMark.git
cd MetaMark

# Install frontend dependencies
cd metamark
npm install

# Go back to root
cd ..

# Setup smart contracts
cd contracts
npm install
npx hardhat compile
