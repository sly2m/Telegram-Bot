async function getCurrencyInfo(symbol, currencyAPIKey) {
    const CurrencyAPI = (await import('@everapi/currencyapi-js')).default;
    const currencyInfo = await new CurrencyAPI(currencyAPIKey);
    const words = symbol.split(' ');
    const base_currency = words[1];
    const currencies = words[3];
    const value = words[0];
    // check if value is a number
    if (isNaN(value)) {
        return null;
    } else {
        const response = await currencyInfo.latest({
            base_currency: base_currency,
            currencies: currencies,
        });

        if (response.data) {
            var rate = response.data[currencies].value;
            var result = (value * rate).toFixed(2);
            var output = `${value} ${base_currency} = ${result} ${currencies}`;
            return { error: false, message: output };
        } else if (response.message && response.message === 'Validation error') {
            if (response.errors && response.errors.base_currency != null)
            {
                return { error: true, message: 'Base currency not found.' };
            }
            else if (response.errors && response.errors.currencies != null) {                
                return { error: true, message: 'Selected currency not found.' };
            }
            else {
                return { error: true, message: 'Unknown error.' };
            }            
        }
    }
}

module.exports = { getCurrencyInfo };
