from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dateutil import parser
from datetime import datetime
import hashlib  # For generating a proof hash
from pprint import pprint

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
    """Make portfolio class, with helper functions."""
    def __init__(self, initial_trades=dict(), initial_pnl=dict()) -> None:
        self.stocks = initial_trades
        self.pnl = initial_pnl

    def update_stock(self, trade: dict) -> None:
        """Update exposure to certain stock."""
        if trade["ticker"] not in self.pnl.keys():
            self.pnl[trade["ticker"]] =\
                float(trade["volume"]) * float(trade["strike_price"])
            self.stocks[trade["ticker"]] = float(trade["volume"])
        else:
            self.pnl[trade["ticker"]] +=\
                float(trade["volume"]) * float(trade["strike_price"])
            self.stocks[trade["ticker"]] += float(trade["volume"])

    def date_range_PF(self, start=0, end=100000000000, new_trades=None):
        """Calculate portfolio value within date range
        Date should be inputted in the following format:
        WeekDay Mon MM YYYY HH:MM:SS GMT+0100 (Central European Standard Time)
        """
        if not isinstance(start, int):
            start = convertDate(start)
        if not isinstance(end, int):
            end = convertDate(end)

        for trade in new_trades:
            if start <= convertDate(trade["time"]) < end:
                self.update_stock(trade)

    def __str__(self):
        clean_stocks = {key: round(value, 2)
                        for key, value in self.stocks.items()}
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
        print(f"reached portfolio creation")
        myPortfolio = Portfolio()
        myPortfolio.date_range_PF(new_trades=new_trades, start=start_date, end=end_date)
        if not myPortfolio.stocks:
            raise ValueError("There were no trades in the time period specified.")

        # Calculate PnL amount (total sum of the PnL values)
        print("Reached pnl calculation")
        pnl_amount = sum(myPortfolio.pnl.values())

        # Generate proof hash
        print("Reached pre-hash")
        proof_hash = generate_proof_hash(myPortfolio.stocks, myPortfolio.pnl)
        print("something")
        pprint(jsonify({
            "proof_hash": proof_hash,
            "pnl_amount": round(pnl_amount, 2),
            "stocks": myPortfolio.stocks,
            "pnl": myPortfolio.pnl
        }))
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
