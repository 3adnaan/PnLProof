'use client';
import Button from './components/Button';

export default function Home() {
    return (
        <div className="home-container">
            <div className="content">
                <h1 className="heading">PNL Proof Generator</h1>
                <p className="subheading">Generate and verify your PNL proof securely.</p>
                <div className="button-group">
                    <Button href="/generate1" text="Generate Proof" />
                    <Button href="/verify2" text="Verify Proof" />
                </div>
            </div>
        </div>
    );
}
