/* ==========================================
   CRYPTO DASHBOARD
   PART 1A - LIVE PRICES
========================================== */

const apiURL =
"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

async function loadCryptoPrices(){

    try{

        const response = await fetch(apiURL);

        const data = await response.json();

        displayCryptoPrices(data);

    }

    catch(error){

        console.error("Error fetching cryptocurrency data:", error);

        document.getElementById("cryptoTable").innerHTML =

        `<tr>

            <td colspan="4">

                Unable to load cryptocurrency prices.

            </td>

        </tr>`;

    }

}

function displayCryptoPrices(coins){

    const table = document.getElementById("cryptoTable");

    table.innerHTML = "";

    coins.forEach(coin => {

        const row = document.createElement("tr");

        const change =
        coin.price_change_percentage_24h;

        const colour =
        change >= 0 ?
        "price-up" :
        "price-down";

        row.innerHTML =

        `
        <td>

            <img
            src="${coin.image}"
            width="25"
            height="25">

            ${coin.name}

        </td>

        <td>

            $${coin.current_price.toLocaleString()}

        </td>

        <td class="${colour}">

            ${change.toFixed(2)}%

        </td>

        <td>

            $${coin.market_cap.toLocaleString()}

        </td>
        `;

        table.appendChild(row);

    });

}

/* ==========================================
   AUTO LOAD
========================================== */

loadCryptoPrices();

/* ==========================================
   REFRESH EVERY 60 SECONDS
========================================== */

setInterval(loadCryptoPrices,60000);


/* ==========================================
   PART 1B - INTERACTIVE PRICE CHART
========================================== */

let cryptoChart = null;

async function loadPriceChart() {

    try {

        const response = await fetch(apiURL);

        const data = await response.json();

        const labels = data.map(coin => coin.symbol.toUpperCase());

        const prices = data.map(coin => coin.current_price);

        createChart(labels, prices);

    }

    catch (error) {

        console.error("Chart Error:", error);

    }

}

function createChart(labels, prices) {

    const ctx = document
        .getElementById("priceChart")
        .getContext("2d");

    if (cryptoChart) {

        cryptoChart.destroy();

    }

    cryptoChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Live Price (USD)",

                    data: prices,

                    borderColor: "#00d4ff",

                    backgroundColor: "rgba(0,212,255,0.2)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.4,

                    pointRadius: 5,

                    pointHoverRadius: 8

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff",

                        font: {

                            size: 14

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.08)"

                    }

                },

                y: {

                    beginAtZero: false,

                    ticks: {

                        color: "#ffffff",

                        callback: function(value) {

                            return "$" + value.toLocaleString();

                        }

                    },

                    grid: {

                        color: "rgba(255,255,255,0.08)"

                    }

                }

            }

        }

    });

}

/* ==========================================
   LOAD CHART
========================================== */

loadPriceChart();

/* ==========================================
   AUTO REFRESH EVERY 60 SECONDS
========================================== */

setInterval(loadPriceChart, 60000);


/* ==========================================
   PART 1C - MARKET TRENDS
========================================== */

// ------------------------------
// Load Top Gainers & Top Losers
// ------------------------------

async function loadMarketTrends() {

    try {

        const response = await fetch(apiURL);

        const coins = await response.json();

        // Sort for Top Gainers
        const gainers = [...coins]
            .sort((a, b) =>
                b.price_change_percentage_24h -
                a.price_change_percentage_24h)
            .slice(0, 5);

        // Sort for Top Losers
        const losers = [...coins]
            .sort((a, b) =>
                a.price_change_percentage_24h -
                b.price_change_percentage_24h)
            .slice(0, 5);

        displayGainers(gainers);

        displayLosers(losers);

    }

    catch (error) {

        console.error("Market Trends Error:", error);

    }

}

// ------------------------------
// Display Top Gainers
// ------------------------------

function displayGainers(coins) {

    const list = document.getElementById("gainers");

    list.innerHTML = "";

    coins.forEach(coin => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${coin.name}</span>
            <span class="gain">
                ▲ ${coin.price_change_percentage_24h.toFixed(2)}%
            </span>
        `;

        list.appendChild(li);

    });

}

// ------------------------------
// Display Top Losers
// ------------------------------

function displayLosers(coins) {

    const list = document.getElementById("losers");

    list.innerHTML = "";

    coins.forEach(coin => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${coin.name}</span>
            <span class="loss">
                ▼ ${coin.price_change_percentage_24h.toFixed(2)}%
            </span>
        `;

        list.appendChild(li);

    });

}

// ------------------------------
// Trending Coins
// ------------------------------

async function loadTrendingCoins() {

    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/search/trending"
        );

        const data = await response.json();

        const list = document.getElementById("trending");

        list.innerHTML = "";

        data.coins.forEach(item => {

            const coin = item.item;

            const li = document.createElement("li");

            li.innerHTML = `
                <span>${coin.name}</span>
                <span class="neutral">
                    Rank #${coin.market_cap_rank}
                </span>
            `;

            list.appendChild(li);

        });

    }

    catch (error) {

        console.error("Trending Coins Error:", error);

    }

}

/* ==========================================
   INITIAL LOAD
========================================== */

loadMarketTrends();

loadTrendingCoins();

/* ==========================================
   AUTO REFRESH EVERY 60 SECONDS
========================================== */

setInterval(loadMarketTrends, 60000);

setInterval(loadTrendingCoins, 60000);


/* ==========================================
   PART 2A - WATCHLIST (LOCAL STORAGE)
========================================== */

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

/* ------------------------------------------
   Save Watchlist
------------------------------------------ */

function saveWatchlist() {

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

}

/* ------------------------------------------
   Display Watchlist
------------------------------------------ */

function displayWatchlist() {

    const list =
    document.getElementById("watchlistItems");

    list.innerHTML = "";

    if (watchlist.length === 0) {

        list.innerHTML = `
            <li>
                No coins added to your watchlist.
            </li>
        `;

        return;

    }

    watchlist.forEach((coin, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${coin}</span>

            <button onclick="removeWatchlist(${index})">
                Remove
            </button>
        `;

        list.appendChild(li);

    });

}

/* ------------------------------------------
   Add Coin
------------------------------------------ */

function addWatchlist() {

    const input =
    document.getElementById("coinInput");

    const coin =
    input.value.trim();

    if (coin === "") {

        alert("Please enter a coin name.");

        return;

    }

    const exists = watchlist.some(item =>
        item.toLowerCase() === coin.toLowerCase()
    );

    if (exists) {

        alert("Coin already exists in watchlist.");

        input.value = "";

        return;

    }

    watchlist.push(coin);

    saveWatchlist();

    displayWatchlist();

    input.value = "";

}

/* ------------------------------------------
   Remove Coin
------------------------------------------ */

function removeWatchlist(index) {

    watchlist.splice(index, 1);

    saveWatchlist();

    displayWatchlist();

}

/* ------------------------------------------
   Enter Key Support
------------------------------------------ */

document
.getElementById("coinInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        addWatchlist();

    }

});

/* ------------------------------------------
   Initial Load
------------------------------------------ */

displayWatchlist();


/* ==========================================
   PART 2B-1 - PORTFOLIO TRACKER
========================================== */

let portfolio =
JSON.parse(localStorage.getItem("portfolio")) || [];

/* ------------------------------------------
   Save Portfolio
------------------------------------------ */

function savePortfolio(){

    localStorage.setItem(
        "portfolio",
        JSON.stringify(portfolio)
    );

}

/* ------------------------------------------
   Display Portfolio
------------------------------------------ */

function displayPortfolio(){

    const table =
    document.getElementById("portfolioTable");

    table.innerHTML = "";

    if(portfolio.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="5">
                No portfolio added yet.
            </td>
        </tr>
        `;

        return;

    }

    portfolio.forEach((coin,index)=>{

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${coin.name}</td>

        <td>${coin.amount}</td>

        <td>$${Number(coin.buyPrice).toFixed(2)}</td>

        <td id="currentPrice${index}">
            Loading...
        </td>

        <td id="profitLoss${index}">
            Loading...
        </td>
        `;

        table.appendChild(row);

    });

}

/* ------------------------------------------
   Add Portfolio
------------------------------------------ */

function addPortfolio(){

    const name =
    document.getElementById("coinName")
    .value
    .trim();

    const amount =
    parseFloat(
    document.getElementById("coinAmount")
    .value);

    const buyPrice =
    parseFloat(
    document.getElementById("buyPrice")
    .value);

    if(name === ""){

        alert("Enter coin name.");

        return;

    }

    if(isNaN(amount) || amount <= 0){

        alert("Enter a valid amount.");

        return;

    }

    if(isNaN(buyPrice) || buyPrice <= 0){

        alert("Enter a valid buy price.");

        return;

    }

    portfolio.push({

        name:name,

        amount:amount,

        buyPrice:buyPrice

    });

    savePortfolio();

    displayPortfolio();

    clearPortfolioInputs();

}

/* ------------------------------------------
   Clear Inputs
------------------------------------------ */

function clearPortfolioInputs(){

    document.getElementById("coinName").value="";

    document.getElementById("coinAmount").value="";

    document.getElementById("buyPrice").value="";

}

/* ------------------------------------------
   Initial Load
------------------------------------------ */

displayPortfolio();


/* ==========================================
   MODULE A
   GET LIVE COIN PRICE
========================================== */

async function getCoinPrice(coinName) {

    try {

        const coinId = coinName.trim().toLowerCase();

        const url =
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch coin price.");
        }

        const data = await response.json();

        if (!data[coinId]) {
            return null;
        }

        return data[coinId].usd;

    }

    catch (error) {

        console.error("Price Fetch Error:", error);

        return null;

    }

}