const axios = require("axios");

const providers = [
  {
    name: "CoinGecko",
    url: "https://api.coingecko.com/api/v3/simple/price",
    params: { ids: "bitcoin", vs_currencies: "usd" },
    read: (data) => data?.bitcoin?.usd,
  },
  {
    name: "Coinbase",
    url: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
    read: (data) => data?.data?.currency === "USD" ? data.data.amount : undefined,
  },
];

async function getBitcoinPrice({ client = axios, logger = console } = {}) {
  for (const provider of providers) {
    try {
      const response = await client.get(provider.url, {
        params: provider.params,
        timeout: 8000,
        signal: AbortSignal.timeout(10000),
      });
      const value = provider.read(response.data);
      const price = typeof value === "number" || typeof value === "string"
        ? Number(value)
        : NaN;
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Invalid BTC/USD price response");
      }
      return price;
    } catch (error) {
      logger.warn("Bitcoin price provider failed:", {
        provider: provider.name,
        code: error.code,
        message: error.message,
        status: error.response?.status,
      });
    }
  }
  throw new Error("All Bitcoin price providers failed");
}

module.exports = { getBitcoinPrice };
