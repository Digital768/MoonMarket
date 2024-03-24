import config
import finnhub

FINNHUB_API_KEY = config.FINNHUB_API_KEY


def get_stock_quote(FINNHUB_API_KEY,stock_ticker):
    finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)
    stock_info = finnhub_client.quote(stock_ticker)
    return stock_info

print(get_stock_quote(FINNHUB_API_KEY,'NVDA'))