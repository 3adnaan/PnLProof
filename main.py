import numpy as np

# INPUT
[initial position]
[date, ticker, volume]


# ASSUMPTIONS
# You don't care who has access to your PnL value, you just want to be able to
# verify it

class Portfolio:
    """Make portfolio class, with helper functions."""
    def __init__(self):
        self.stocks = dict()

    def update_stock(self, date, ticker, volume, price):
        if ticker not in self.stocks.keys():
            self.stocks[ticker] = volume * price
        else:
            self.stocks[ticker] += volume * price
