const test = require("node:test");
const assert = require("node:assert/strict");
const { getBitcoinPrice } = require("./bitcoinPrice");

function mock(responses) {
  const calls = [];
  const warnings = [];
  return {
    calls,
    warnings,
    logger: { warn: (...args) => warnings.push(args) },
    client: {
      async get(url, options) {
        calls.push({ url, options });
        const response = responses.shift();
        if (response instanceof Error) throw response;
        return { data: response };
      },
    },
  };
}

test("uses the primary price without requesting the fallback", async () => {
  const setup = mock([{ bitcoin: { usd: 60000 } }]);
  assert.equal(await getBitcoinPrice(setup), 60000);
  assert.equal(setup.calls.length, 1);
  assert.equal(setup.calls[0].options.timeout, 8000);
});

test("falls back after rate limiting or a network timeout", async () => {
  for (const error of [
    Object.assign(new Error("Rate limited"), { response: { status: 429 } }),
    Object.assign(new Error("Timeout"), { code: "ECONNABORTED" }),
  ]) {
    const setup = mock([error, { data: { amount: "61000.50", currency: "USD" } }]);
    assert.equal(await getBitcoinPrice(setup), 61000.5);
    assert.match(setup.calls[1].url, /coinbase/);
    assert.equal(setup.warnings.length, 1);
  }
});

test("rejects invalid primary prices and uses a valid fallback", async () => {
  for (const usd of [0, -1, null, true, "invalid", Infinity]) {
    const setup = mock([{ bitcoin: { usd } }, { data: { amount: "61000", currency: "USD" } }]);
    assert.equal(await getBitcoinPrice(setup), 61000);
    assert.equal(setup.calls.length, 2);
  }
});

test("fails when neither provider supplies a valid USD price", async () => {
  for (const fallback of [
    new Error("Network unavailable"),
    { data: { amount: "60000", currency: "EUR" } },
    { data: { amount: "0", currency: "USD" } },
  ]) {
    const setup = mock([new Error("Unavailable"), fallback]);
    await assert.rejects(getBitcoinPrice(setup), /All Bitcoin price providers failed/);
  }
});
