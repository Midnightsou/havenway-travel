const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidBitcoinAddress } = require("./bitcoinAddress");

test("accepts valid mainnet legacy and SegWit addresses", () => {
  assert.equal(isValidBitcoinAddress("1BoatSLRHtKNngkdXEeobR76b53LETtpyT"), true);
  assert.equal(isValidBitcoinAddress("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"), true);
});

test("rejects malformed, testnet, and checksum-invalid addresses", () => {
  assert.equal(isValidBitcoinAddress("1BoatSLRHtKNngkdXEeobR76b53LETtpyU"), false);
  assert.equal(isValidBitcoinAddress("tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"), false);
  assert.equal(isValidBitcoinAddress("bc1not-an-address"), false);
});
