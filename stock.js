const fetch = import('node-fetch');

async function getStockInfo(symbol, stockAPIKey) {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.marketdata.app/v1/stocks/quotes/${symbol}/?token=${stockAPIKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response;
}

module.exports = getStockInfo;