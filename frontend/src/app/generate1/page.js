'use client';

import { useState } from 'react';

export default function GenerateProof() {
    const [walletHash, setWalletHash] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [generatedProof, setGeneratedProof] = useState(null);
    const [pnlAmount, setPnlAmount] = useState(null);
    const [error, setError] = useState('');

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);

        if (endDate && selectedStartDate > endDate) {
            setError('Start date cannot be after end date');
        } else {
            setError('');
        }
    };

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        setEndDate(selectedEndDate);

        if (startDate && selectedEndDate < startDate) {
            setError('End date cannot be before start date');
        } else {
            setError('');
        }
    };

    const handleGenerateProof = async () => {
        setError(''); // Clear previous errors

        console.log("walletHash:", walletHash);
        console.log("startDate:", startDate);
        console.log("endDate:", endDate);

        if (!walletHash || !startDate || !endDate) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate-proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletHash, startDate, endDate }),
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedProof(data.proof_hash);
                setPnlAmount(data.pnl_amount);
            } else {
                setError(data.error || 'An error occurred');
            }
        } catch (err) {
            setError('Failed to connect to the backend');
        }
    };

    return (
        <div className="generate-proof-container">
            <h1 className="heading">Generate Proof</h1>
            <p className="subheading">Enter wallet hash and period to generate the proof.</p>

            <div className="input-container">
                <input
                    type="text"
                    value={walletHash}
                    onChange={(e) => setWalletHash(e.target.value)}
                    placeholder="Wallet Hash"
                    className="input-field"
                    required
                />

                <div className="date-inputs">
                    <div>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="input-field"
                            required
                        />
                    </div>
                </div>
            </div>

            <button onClick={handleGenerateProof} className="btn">
                Generate Proof
            </button>

            {error && <p className="error-message">{error}</p>}

            {generatedProof && (
                <div className="proof-result">
                    <h2>Generated Proof Hash:</h2>
                    <p>{generatedProof}</p>
                    <h3>PNL Amount: ${pnlAmount}</h3>

                    {/* Optional: Display stocks and pnl breakdown */}
                    <div>
                        <h3>Stock Holdings:</h3>
                        <ul>
                            {Object.keys(data.stocks).map((ticker) => (
                                <li key={ticker}>
                                    {ticker}: {data.stocks[ticker]} shares
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>PnL per Stock:</h3>
                        <ul>
                            {Object.keys(data.pnl).map((ticker) => (
                                <li key={ticker}>
                                    {ticker}: ${data.pnl[ticker].toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
