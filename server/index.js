const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const BTC_RECEIVING_ADDRESS =
  process.env.BTC_RECEIVING_ADDRESS;

app.use(cors());
app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Havenway payment server is running",
  });
});


// Check Bitcoin payment
app.get("/api/check-payment", async (req, res) => {
  try {
    const expectedBtc = Number(req.query.amount);
    const paymentStartedAt = Number(req.query.paymentStartedAt);

    if (!expectedBtc || expectedBtc <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid BTC amount",
      });
    }

    if (!paymentStartedAt || paymentStartedAt <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment start time",
      });
    }

    if (!BTC_RECEIVING_ADDRESS) {
      return res.status(500).json({
        success: false,
        error: "BTC receiving address is not configured",
      });
    }

    const response = await axios.get(
      `https://blockstream.info/api/address/${BTC_RECEIVING_ADDRESS}/txs`,
      {
        timeout: 30000,

        httpsAgent: new https.Agent({
          family: 4,
        }),
      }
    );

    const transactions = response.data;

    let matchingPayment = null;

    for (const transaction of transactions) {

      const matchingOutputs = transaction.vout.filter(
        (output) =>
          output.scriptpubkey_address ===
          BTC_RECEIVING_ADDRESS
      );

      if (matchingOutputs.length === 0) {
        continue;
      }

      /*
       * Add all outputs going to our BTC address.
       */
      const receivedSatoshis =
        matchingOutputs.reduce(
          (total, output) =>
            total + output.value,
          0
        );

      const receivedBtc =
        receivedSatoshis / 100000000;

      /*
       * If the transaction is confirmed,
       * make sure it happened after the
       * payment session started.
       */
      if (transaction.status?.confirmed) {

        const blockTime =
          transaction.status.block_time
            ? transaction.status.block_time * 1000
            : null;

        if (
          blockTime &&
          blockTime < paymentStartedAt
        ) {
          continue;
        }
      }

      /*
       * Ignore transactions that don't
       * contain enough BTC.
       */
      if (receivedBtc < expectedBtc) {
        continue;
      }

      matchingPayment = {
        txid: transaction.txid,
        amountBtc: receivedBtc,
        blockHeight:
          transaction.status?.block_height || null,
        blockTime:
          transaction.status?.block_time || null,
        confirmations: 0,
        confirmed: false,
      };

      break;
    }

    /*
     * No new matching payment found.
     */
    if (!matchingPayment) {
      return res.json({
        success: true,
        paymentFound: false,
        confirmed: false,
      });
    }

    /*
     * Calculate actual confirmations.
     *
     * We need the current blockchain tip
     * to calculate the actual confirmation count.
     */
    if (matchingPayment.blockHeight) {

      const tipResponse = await axios.get(
        "https://blockstream.info/api/blocks/tip/height",
        {
          timeout: 30000,

          httpsAgent: new https.Agent({
            family: 4,
          }),
        }
      );

      const currentHeight =
        Number(tipResponse.data);

      const confirmations =
        currentHeight -
        matchingPayment.blockHeight +
        1;

      matchingPayment.confirmations =
        Math.max(confirmations, 0);
    }

    /*
     * A payment is confirmed only when the
     * Bitcoin network has actually included it
     * in a block (1 or more confirmations).
     *
     * 0 confirmations  -> waiting
     * 1+ confirmations -> payment confirmed
     */
    matchingPayment.confirmed =
      matchingPayment.confirmations >= 1;

    return res.json({
      success: true,
      paymentFound: true,
      ...matchingPayment,
    });

  } catch (error) {

    console.error(
      "===== BITCOIN CHECK ERROR ====="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
    );

    console.error(
      "================================"
    );

    return res.status(500).json({
      success: false,
      error: "Failed to check Bitcoin payment",
      debug: error.message,
    });
  }
});


app.listen(PORT, () => {

  console.log(
    `Havenway payment server running on port ${PORT}`
  );

});