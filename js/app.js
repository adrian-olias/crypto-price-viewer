const arrayCoins = [
  { name: "bitcoin", image: "./assets/img/btc.png" },
  { name: "ethereum", image: "./assets/img/eth.png" },
  { name: "tether", image: "./assets/img/tether.png" },
  { name: "binancecoin", image: "./assets/img/bnb.png" },
  { name: "solana", image: "./assets/img/solana.png" },
  { name: "usd-coin", image: "./assets/img/usd.png" },
  { name: "ripple", image: "./assets/img/xrp.png" },
  { name: "cardano", image: "./assets/img/cardano.png" },
  { name: "avalanche-2", image: "./assets/img/avalanche.png" },
  { name: "dogecoin", image: "./assets/img/dogecoin.png" },
  { name: "tron", image: "./assets/img/tron.png" },
  { name: "polkadot", image: "./assets/img/polkadot.png" },
  { name: "chainlink", image: "./assets/img/chainlink.png" },
  { name: "matic-network", image: "./assets/img/polygon.png" },
  { name: "shiba-inu", image: "./assets/img/shiba.png" },
  { name: "dai", image: "./assets/img/dai.png" },
  { name: "litecoin", image: "./assets/img/ltc.png" },
  { name: "internet-computer", image: "./assets/img/icp.png" },
  { name: "bitcoin-cash", image: "./assets/img/bch.png" },
  { name: "uniswap", image: "./assets/img/uniswap.png" },
  { name: "leo-token", image: "./assets/img/unus.png" },
  { name: "ethereum-classic", image: "./assets/img/etc.png" },
  { name: "stellar", image: "./assets/img/xlm.png" },
  { name: "okb", image: "./assets/img/okb.png" },
  { name: "near", image: "./assets/img/near.png" },
  { name: "monero", image: "./assets/img/monero.png" },
  { name: "filecoin", image: "./assets/img/filecoin.png" },
  { name: "injective-protocol", image: "./assets/img/inj.png" },
  { name: "lido-dao", image: "./assets/img/lido.png" },
  { name: "cosmos", image: "./assets/img/cosmos.png" },
  { name: "crypto-com-chain", image: "./assets/img/cro.png" },
  { name: "blockstack", image: "./assets/img/stx.png" },
  { name: "vechain", image: "./assets/img/vet.png" },
  { name: "true-usd", image: "./assets/img/tusd.png" },
];

const getData = async () => {
  const ids = arrayCoins.map((coin) => coin.name).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`;

  try {
    // One request for all coins
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko responded with ${response.status}`);
    }
    const markets = await response.json();
    mappeoDato(markets);
  } catch (error) {
    console.error("Could not load prices:", error);
    document.getElementById("app").innerHTML = '<p class="status">Could not load prices. Please try again later.</p>';
  }
};

// Rounds to the 2 decimals we display, so "-0.00" counts as flat
const trendOf = (value) => {
  const rounded = Number(value.toFixed(2));
  if (rounded > 0) return "up";
  if (rounded < 0) return "down";
  return "flat";
};

const mappeoDato = (markets) => {
  // Keep the order from arrayCoins and attach the local image by id
  const data = arrayCoins
    .map((coin) => markets.find((market) => market.id === coin.name))
    .filter(Boolean)
    .map((market) => {
      const change = Number(market.price_change_percentage_24h ?? 0);
      return {
        rank: market.market_cap_rank ?? "-",
        id: market.name,
        symbol: market.symbol.toUpperCase(),
        priceUsd: Number(market.current_price).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(market.current_price) < 1 ? 6 : 2,
        }),
        image: arrayCoins.find((coin) => coin.name === market.id).image,
        link: `https://www.coingecko.com/en/coins/${market.id}`,
        changePercent24Hr: (Number(change.toFixed(2)) + 0).toFixed(2), // +0 turns -0 into 0
        trend: trendOf(change),
      };
    });

  printGallery(data);
};

const printGallery = (dataPrint) => {
  const app = document.getElementById("app");

  const rows = dataPrint
    .map((coin) => {
      const sign = coin.trend === "up" ? "+" : "";
      return `
        <tr>
          <td class="col-rank">${coin.rank}</td>
          <td>
            <div class="coin">
              <img src="${coin.image}" alt="${coin.id} logo" />
              <div class="coin-name">
                <span class="name">${coin.id}</span>
                <span class="sym">${coin.symbol}</span>
              </div>
            </div>
          </td>
          <td class="num price">$${coin.priceUsd}</td>
          <td class="num"><span class="change ${coin.trend}">${sign}${coin.changePercent24Hr}%</span></td>
          <td class="col-action"><a class="btn" target="_blank" rel="noopener" href="${coin.link}">View</a></td>
        </tr>`;
    })
    .join("");

  app.innerHTML = `
    <div class="table-wrap">
      <table class="market">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th>Coin</th>
            <th class="num">Price</th>
            <th class="num">24h</th>
            <th class="col-action"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
};

getData();
