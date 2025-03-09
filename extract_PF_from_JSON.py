import requests
import json
from pprint import pprint
from dateutil import parser
from datetime import datetime


def convertDate(date: str) -> int:
    """Converts date string of form
    Wed Feb 12 2025 18:10:33 GMT+0100 (Central European Standard Time)
    to YYYY/MM/DD HH:MM:SS format"""
    cleaned_date_string = date.split(" (")[0]
    date_obj = parser.parse(cleaned_date_string)
    formatted_date = date_obj.strftime("%Y/%m/%d %H:%M:%S")
    date_obj = datetime.strptime(formatted_date, "%Y/%m/%d %H:%M:%S")
    timestamp_float = date_obj.timestamp()
    return int(timestamp_float)


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


# LOAD TRADES FROM API
url = "http://localhost:3001/users"  # Check it in the Mockoon instance
myResponse = requests.get(url)
new_trades = json.loads(myResponse.content)


myPortfolio = Portfolio()
myPortfolio.date_range_PF(new_trades=new_trades)
