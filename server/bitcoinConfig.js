const supabase = require("./supabase");
const { isValidBitcoinAddress } = require("./bitcoinAddress");

const SETTING_KEY = "bitcoin_receiving_address";

async function getBitcoinReceivingAddress() {
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", SETTING_KEY)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load Bitcoin payment settings: ${error.message}`);
  }

  const address = data?.value || process.env.BTC_RECEIVING_ADDRESS;
  if (typeof address !== "string" || !address.trim()) {
    throw new Error("Bitcoin receiving address is not configured");
  }
  const normalizedAddress = address.trim();
  if (!isValidBitcoinAddress(normalizedAddress)) {
    throw new Error("Configured Bitcoin receiving address is invalid");
  }
  return normalizedAddress;
}

module.exports = { SETTING_KEY, getBitcoinReceivingAddress };
