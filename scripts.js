import { header } from './partial_scripts/header.js';
import { tabWidget } from './partial_scripts/tab_widget.js';
import { conversionWidget } from './partial_scripts/converter.js';
import { converterResults } from './partial_scripts/converter.js';
import { conversionTable } from './partial_scripts/converter.js';



const pageParts = [
    header,
    tabWidget('Currency Converter', 'Convert')
]

let EXR = {
    "date": "2022-09-24",
    "rates": {
        "AUD": 1.531863,
        "CAD": 1.36029,
        "CLP": 950.662057,
        "CNY": 7.128404,
        "EUR": 1.03203,
        "GBP": 0.920938,
        "INR": 81.255504,
        "JPY": 143.376504,
        "RUB": 57.875038,
        "ZAR": 17.92624
    }
};

document.querySelector('#app').insertAdjacentHTML('beforeend', [...pageParts].join(''));

const createForm = (symbols) => {
    document.querySelector('#main-widget').insertAdjacentHTML('beforeend', conversionWidget(symbols));
    document.querySelector('#main-widget').insertAdjacentHTML('beforeend', '<div id="results-display"></div>');
    document.querySelector('#main-widget').insertAdjacentHTML('beforeend', '<div id="1-table"></div>');
    // swap button code.
    const swap = document.querySelector(".swap-button");
    const currencyOne = document.getElementById("currency-one");
    const currencyTwo = document.getElementById("currency-two");

    swap.addEventListener('click', (event) => {
        event.preventDefault();

        const temp = currencyTwo.value;
        currencyTwo.value = currencyOne.value;
        currencyOne.value = temp;
        
    });

    // Next task Convert button working.
    const convertButton = document.getElementById("convert-Btn");
        convertButton.addEventListener('click', (event) => {
            event.preventDefault();

            const fromCurrency = currencyOne.value;
            const toCurrency = currencyTwo.value;
            const amount = parseFloat(document.getElementById("amount-input").value);

            const convertedValue = calculateConversion(fromCurrency, toCurrency, amount);
            const resultsContainer = document.getElementById("results-display");
            if (convertedValue !== null) {
                const symbols = fromCurrency + ' to ' + toCurrency;
                console.log(document.getElementById("results-display"));
                resultsContainer.innerHTML = converterResults(amount, convertedValue, symbols);

                const lTableDiv = document.getElementById("1-table");
                console.log(lTableDiv);
                const amounts = [1, 5, 25, 50, 100, 1000, 5000, 10000];
                const fromRate = EXR.rates[fromCurrency];
                const toRate = EXR.rates[toCurrency];

                const lTableRows = generateTableRows(fromCurrency, toCurrency, fromRate, toRate, amounts);
                const rTableRows = generateTableRows(toCurrency, fromCurrency, toRate, fromRate, amounts);
                console.log(lTableRows);
                lTableDiv.innerHTML = `
                <div class="table-fixed">
                    ${conversionTable(fromCurrency, toCurrency, lTableRows)}
                </div>`

            }

        });
}
function generateTableRows(fromCurrency, toCurrency, fromRate, toRate, amounts) {
    return amounts.map(amount => {
        const convertedAmount = calculateConversion(fromCurrency, toCurrency, amount, fromRate, toRate);
        return `<tr>
                    <td class="py-2">${amount} ${fromCurrency}</td>
                    <td class="py-2">${convertedAmount.toFixed(6)} ${toCurrency}</td>
                </tr>`;
    }).join('');
}

function calculateConversion(fromCurrency, toCurrency, amount) {
    // Check if the currencies are valid in the conversion rates object
    if (fromCurrency in EXR.rates && toCurrency in EXR.rates) {
        // Calculate the conversion
        const fromRate = EXR.rates[fromCurrency];
        const toRate = EXR.rates[toCurrency];
        const convertedAmount = (amount *  fromRate) / toRate;
        return convertedAmount;
    } else {
        // Handle the case where one or both currencies are not in the rates object
        console.error('Invalid currency selection');
        return null; // or return an error message
    }
}


// backend code, saves locally decreasing api calls to the main website for usages.
if (localStorage.getItem('symbols') === null || localStorage.getItem('symbols') === '{}') {
    // fetching data from apilayer exchangerates_data
    fetch("https://api.apilayer.com/exchangerates_data/symbols", {
    method: 'GET',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'uQlaDIrZRm18S1ofwJWdq8pICwRmHFLZ'
    }
})
    .then(response => response.json())
    .then(result => {
        localStorage.setItem('symbols', JSON.stringify(result.symbols));
        createForm(result.symbols);
    })
    .catch(error => console.error('error', error));
    
} else {
    createForm(JSON.parse(localStorage.getItem('symbols')));
}