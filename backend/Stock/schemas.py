def individial_serial(stock) ->dict:
    return {
        "id":str(stock["_id"]),
        "name": stock["name"],
        "ticker": stock["ticker"],
        "bought_price": stock["bought_price"],
        "last_price": stock["last_price"],
        "quantity": stock["quantity"],
        "value": stock["value"]
    }

def list_serial(stocks) -> list:
    return [individial_serial(stock) for stock in stocks]    