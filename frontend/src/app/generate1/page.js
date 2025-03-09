'use client';

import { useState } from 'react';

export default function GenerateProof() {
    const [walletHash, setWalletHash] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [generatedProof, setGeneratedProof] = "7mWxjLYgbJUkZNcGouvhVj5tJ8yu9hoexb9ntvPK8t5LHqzmrL6QJjjKtf5SgmxB4QWkDw7qoMMbbNGtHVpsbJHPyTy2EzRQ";
    const [pnlAmount, setPnlAmount] = useState(null);
    const [error, setError] = useState('');

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);

        // If start date is after end date, show error
        if (selectedStartDate > endDate && endDate !== '') {
            setError('Start date cannot be after end date');
        } else {
            setError('');
        }
    };

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        setEndDate(selectedEndDate);

        // If end date is before start date, show error
        if (selectedEndDate < startDate && startDate !== '') {
            setError('End date cannot be before start date');
        } else {
            setError('');
        }
    };

    const handleGenerateProof = () => {
        // If there’s an error or any required field is empty, prevent generating proof
        if (error || !walletHash || !startDate || !endDate) {
            setError('All fields are required');
            return;
        }

        // Replace with actual logic to generate proof
        const proof = `Generated proof for wallet: ${walletHash}, Period: ${startDate} to ${endDate}`;
        const pnl = 10573; // Example random PNL amount

        setGeneratedProof(proof);
        setPnlAmount(pnl.toFixed(2));
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

            <button onClick={handleGenerateProof} className="btn" disabled={error}>
                Generate Proof
            </button>

            {error && <p className="error-message">{error}</p>}

            {generatedProof && (
                <div className="proof-result">
                    <h2>Generated Proof:</h2>
                    <p>{generatedProof}</p>
                    <p>PNL Amount: ${pnlAmount}</p>
                </div>
            )}
        </div>
    );
}
