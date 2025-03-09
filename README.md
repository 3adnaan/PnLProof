# Introducing PnLProof

This project implements a Proof of Profit and Loss (PnL) system that allows users to generate zk-proofs and verify the accuracy of their portfolio's PnL over a specified period. By leveraging Zero-Knowledge Proofs (ZKPs), users can prove the correctness of their PnL calculations without revealing sensitive transaction data. The idea is for the system to integrate with a decentralized exchange (DEX) API to fetch wallet transaction histories and calculate the PnL for given periods. For demonstration purposes, we are currently fetching this data from a local API.

## Key Functionalities

- **Generate Proofs**: Users can input their wallet hash and a time period to generate a Zero-Knowledge Proof (ZKP) along with the calculated PnL amount.
- **Verify Proofs**: Users can input a proof hash, a time period, and a claimed PnL amount to verify if the reported PnL for the given period is correct.
- **DEX Integration**: Transaction data is pulled from the DEX to calculate and store PnL for specific wallet addresses.
- **Zero-Knowledge Proof**: The system generates a zk-proof to validate PnL calculations without revealing sensitive trade data.


## Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/)
- -A Mina wallet (eg. Aura Wallet)

## Running the Application

1. Clone the repository:

   ```bash
   git clone https://github.com/3adnaan/PnLProof
   ```

2. Install dependencies:

    ```bash
    pip install flask
    ```

3. In one terminal window, run the development server:

   ```bash
   npm run dev
   ```

   In another terminal window, run the Python script/app:

    ```bash
    python app.py
    ```
 
