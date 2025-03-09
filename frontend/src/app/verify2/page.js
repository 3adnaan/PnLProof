'use client';

import { useState } from 'react';

export default function VerifyProof() {
    const [proofHash, setProofHash] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [claimedPnl, setClaimedPnl] = useState('');
    const [error, setError] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

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

    const handleVerifyProof = () => {
        // If there’s an error or any required field is empty, prevent verifying proof
        if (error || !proofHash || !startDate || !endDate || !claimedPnl) {
            setError('All fields are required');
            return;
        }

        // Replace with actual logic to verify proof
        const result = `Verification for proof hash: ${proofHash}, Period: ${startDate} to ${endDate}, Claimed PNL: ${claimedPnl}`;
        const isValid = Math.random() > 0.5 ? 'Valid' : 'Invalid';  // Example random verification result

        setVerificationResult(`${result} is ${isValid}`);
    };

    return (
        <div className="verify-proof-container">
            <h1 className="heading">Verify Proof</h1>
            <p className="subheading">Enter proof hash, period, and claimed PNL to verify the proof.</p>

            <div className="input-container">
                <input
                    type="text"
                    value={proofHash}
                    onChange={(e) => setProofHash(e.target.value)}
                    placeholder="Proof Hash"
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

                <div>
                    <label>Claimed PNL</label>
                    <input
                        type="number"
                        value={claimedPnl}
                        onChange={(e) => setClaimedPnl(e.target.value)}
                        placeholder="Claimed PNL"
                        className="input-field"
                        required
                    />
                </div>
            </div>

            <button onClick={handleVerifyProof} className="btn" disabled={error}>
                Verify Proof
            </button>

            {error && <p className="error-message">{error}</p>}

            {verificationResult && (
                <div className="verification-result">
                    <h2>Verification Result:</h2>
                    <p>{verificationResult}</p>
                </div>
            )}
        </div>
    );
}
