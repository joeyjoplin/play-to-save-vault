# DeFi Arcade — Play-to-Save 🎮💸

**Play-to-Save: Turning Gaming Addiction into Healthy Saving Habits** <br> <br>

### Dapp URL: https://play-to-save-vault.vercel.app/ 

---

## 🚩 Problem
Young people often treat **online gambling games** (e.g., Fortune Tiger) as *investments*.  
This misconception leads to **debt**, addiction, and lost savings.

---

## 💡 Our Solution
A **mobile gaming platform** with DeFi themes, where:
- 🎮 Users can **only play after depositing** into a **lending pool**
- 🏦 Deposits are held in a **FeeVault** contract integrated with **Blend**
- 📈 Players **earn real yields** while having fun
- 🧠 Mini-games teach **lending concepts** (utilization, APR, liquidations, risk management)

**Benefit:** Players **learn, save, and earn** — instead of losing money to predatory gambling apps.

---

## ✨ Features
- **On-chain Vault (FeeVault + Blend):**
  - Deposit & withdraw anytime via Freighter wallet
  - Funds earn yield in Blend pools
- **Arcade-style Educational Games:**
  - **Liquidation Dodge** — Reflex game about Health Factor & liquidations
  - **Rate Racer** — Speed challenge balancing utilization & APR
  - **Pool Tycoon** — 1-minute strategy sim managing a lending pool
- **Modern Web App:**
  - React + TypeScript + Vite
  - TailwindCSS + shadcn/ui for clean UI
  - Stellar Soroban + Freighter for blockchain integration
  - Blend Integration - FeeVault

---
## Future Implementation
- Passkey
- Anchor integration (fiat/stable coin)

## 🏗 Architecture

  User((Player)) -- Freighter Wallet --> Frontend
  Frontend -- RPC --> Stellar[Soroban RPC]
  Stellar --> FeeVault[FeeVault Contract]
  FeeVault --> Blend[Blend Lending Pools]
  Blend --> Yield[Real Yield to Players]

🚀 Getting Started
Prerequisites:
- Node.js 18+
- Freighter Wallet installed
- Stellar Testnet RPC
- Stellar SDK
- FeeVault Contract: CB344LHGDJSNBJ4NLUJMAVK4J57DSGAINO3C6ZW7DZKC7L2ZUUJYPPWS

## Installation 
git clone https://github.com/joeyjoplin/play-to-save-vault.git <br>
cd play-to-save-vault <br>
npm install

## Run 
npm run dev
Open http://localhost:8080 and connect your wallet

📚 Business & Learning Impact

Players: Build healthy saving habits and financial literacy
Parents & Educators: Safe alternative to gambling-like apps
Ecosystem: Expands adoption of Stellar + Blend by gamifying DeFi

🤝 Contributing

PRs and ideas are welcome! Open an issue to suggest new games or integrations.

📜 License
MIT — see LICENSE






