async function getStockInfo(symbol, stockAPIKey) {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.marketdata.app/v1/stocks/quotes/${symbol}/?token=${stockAPIKey}&dateformat=timestamp`;
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response;
}

async function getStockNews(symbol, stockAPIKey) {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.marketdata.app/v1/stocks/news/${symbol}/?token=${stockAPIKey}&dateformat=timestamp&limit=1`;
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response;
}

module.exports = { getStockInfo, getStockNews };
