from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dateutil import parser
from datetime import datetime
import hashlib  # For generating a proof hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def convertDate(date: str) -> int:
    """Converts date string to timestamp"""
    if not date:
        return 0  # Default to 0 if date is missing
    cleaned_date_string = date.split(" (")[0]
    date_obj = parser.parse(cleaned_date_string)
    return int(date_obj.timestamp())

def generate_proof_hash(stocks, pnl):
    """Generate a proof hash from stocks and PnL data"""
    data_string = f"{stocks}{pnl}"
    return hashlib.sha256(data_string.encode('utf-8')).hexdigest()

class Portfolio:
    def __init__(self, initial_trades=None, initial_pnl=None) -> None:
        self.stocks = initial_trades if initial_trades else {}
        self.pnl = initial_pnl if initial_pnl else {}

    def update_stock(self, trade: dict) -> None:
        ticker = trade["ticker"]
        volume = float(trade["volume"])
        strike_price = float(trade["strike_price"])
        
        if ticker not in self.pnl:
            self.pnl[ticker] = volume * strike_price
            self.stocks[ticker] = volume
        else:
            self.pnl[ticker] += volume * strike_price
            self.stocks[ticker] += volume

    def date_range_PF(self, new_trades=None, start=None, end=None):
        """Filter trades by date and update portfolio"""
        if start is not None and isinstance(start, str):
            start = convertDate(start)  # Convert start date to timestamp
        if end is not None and isinstance(end, str):
            end = convertDate(end)  # Convert end date to timestamp

        for trade in new_trades or []:
            trade_time = convertDate(trade["time"])
            if start <= trade_time < end:
                self.update_stock(trade)

    def __str__(self):
        clean_stocks = {key: round(value, 2) for key, value in self.stocks.items()}
        clean_pnl = {key: round(value, 2) for key, value in self.pnl.items()}
        return f"Stock holdings: {clean_stocks}\nPnL per Stock: {clean_pnl}"

@app.route('/api/generate-proof', methods=['POST'])
def generate_proof():
    try:
        # Get data from user input
        data = request.get_json()
        wallet_hash = data.get('walletHash')  # Assuming you also want to use walletHash (not directly used here)
        start_date = data.get('startDate')
        end_date = data.get('endDate')

        # Validate input fields
        if not start_date or not end_date or not wallet_hash:
            return jsonify({"error": "All fields (walletHash, startDate, endDate) are required"}), 400

        # Fetch trade data
        trade_api_url = "http://localhost:3002/users"  # Change to actual trade data API endpoint
        try:
            response = requests.get(trade_api_url, timeout=2000)
            response.raise_for_status()
            new_trades = response.json()
        except requests.RequestException as e:
            return jsonify({"error": f"Failed to fetch trade data: {str(e)}"}), 500

        # Create portfolio and process trades
        myPortfolio = Portfolio()
        myPortfolio.date_range_PF(new_trades=new_trades, start=start_date, end=end_date)

        # Calculate PnL amount (total sum of the PnL values)
        pnl_amount = sum(myPortfolio.pnl.values())

        # Generate proof hash
        proof_hash = generate_proof_hash(myPortfolio.stocks, myPortfolio.pnl)

        # Return portfolio details, PnL amount, and proof hash
        return jsonify({
            "proof_hash": proof_hash,
            "pnl_amount": round(pnl_amount, 2),
            "stocks": myPortfolio.stocks,
            "pnl": myPortfolio.pnl
        }), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
