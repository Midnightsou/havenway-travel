const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const supabase = require("./supabase");

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


// Temporary Supabase test endpoint
app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: "Supabase connection successful",
      data,
    });

  } catch (error) {

    console.error(
      "Supabase connection failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
});


// Check Bitcoin payment for a booking
app.get("/api/check-payment", async (req, res) => {
  try {
    const { bookingId } = req.query;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: "bookingId is required",
      });
    }

    /*
     * Get the booking from Supabase.
     */

    const { data: booking, error: bookingError } =
      await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

    if (bookingError || !booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    /*
     * If payment has already been confirmed,
     * don't query the blockchain again unnecessarily.
     */

    if (booking.payment_status === "confirmed") {
      return res.json({
        success: true,
        paymentFound: true,
        confirmed: true,
        transactionId:
          booking.transaction_id,
        amountBtc:
          Number(booking.btc_received),
        confirmations:
          booking.confirmations || 0,
        bookingStatus:
          booking.booking_status,
      });
    }

    const expectedBtc =
      Number(booking.expected_btc);

    if (
      !Number.isFinite(expectedBtc) ||
      expectedBtc <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid expected BTC amount",
      });
    }

    /*
     * Query blockchain.
     */

    const response = await axios.get(
      `https://blockstream.info/api/address/${BTC_RECEIVING_ADDRESS}/txs`,
      {
        timeout: 30000,
        family: 4,
      }
    );

    const transactions =
      response.data;

    let matchingPayment = null;

    /*
     * Look for an output sent to our BTC address.
     */

    for (const transaction of transactions) {

      const outputToOurAddress =
        transaction.vout?.find(
          (output) =>
            output.scriptpubkey_address ===
            BTC_RECEIVING_ADDRESS
        );

      if (!outputToOurAddress) {
        continue;
      }

      const receivedBtc =
        outputToOurAddress.value /
        100000000;

      /*
       * Require the received amount to be
       * at least the expected amount.
       */

      if (receivedBtc >= expectedBtc) {

        const confirmed =
          transaction.status?.confirmed === true;

        const confirmations =
          confirmed ? 1 : 0;

        matchingPayment = {
          txid: transaction.txid,
          amountBtc: receivedBtc,
          confirmations,
          confirmed,
        };

        break;
      }
    }

    /*
     * No matching transaction yet.
     */

    if (!matchingPayment) {

      return res.json({
        success: true,
        paymentFound: false,
        confirmed: false,
        bookingId,
      });
    }

    /*
     * Transaction exists but isn't confirmed yet.
     */

    if (!matchingPayment.confirmed) {

      await supabase
        .from("bookings")
        .update({
          payment_status: "detected",
          transaction_id:
            matchingPayment.txid,
          btc_received:
            matchingPayment.amountBtc,
          confirmations:
            matchingPayment.confirmations,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", bookingId);

      return res.json({
        success: true,
        paymentFound: true,
        confirmed: false,
        bookingId,
        transactionId:
          matchingPayment.txid,
        amountBtc:
          matchingPayment.amountBtc,
        confirmations:
          matchingPayment.confirmations,
      });
    }

    /*
     * Payment is confirmed.
     */

    const paymentConfirmedAt =
      new Date().toISOString();

    const { error: updateError } =
      await supabase
        .from("bookings")
        .update({
          payment_status: "confirmed",
          booking_status: "confirmed",

          transaction_id:
            matchingPayment.txid,

          btc_received:
            matchingPayment.amountBtc,

          confirmations:
            matchingPayment.confirmations,

          payment_confirmed_at:
            paymentConfirmedAt,

          updated_at:
            paymentConfirmedAt,
        })
        .eq("id", bookingId);

    if (updateError) {
      throw updateError;
    }

    return res.json({
      success: true,
      paymentFound: true,
      confirmed: true,

      bookingId,

      transactionId:
        matchingPayment.txid,

      amountBtc:
        matchingPayment.amountBtc,

      confirmations:
        matchingPayment.confirmations,

      bookingStatus: "confirmed",
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
      error:
        "Failed to check Bitcoin payment",
      debug: error.message,
    });
  }
});

// Create a Bitcoin payment session
app.post("/api/create-payment", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      travellers = 1,

      startDate,
      endDate,
      nights = 0,
      days = 0,

      selectedHotel = null,
      selectedRoom = null,
      selectedFlight = null,
      selectedCar = null,
      selectedActivities = [],
      selectedPackage = null,

      usdTotal,
    } = req.body;

    // Basic validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name, email and phone are required",
      });
    }

    const totalUsd = Number(usdTotal);

    if (!Number.isFinite(totalUsd) || totalUsd <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking total",
      });
    }

    /*
      Get the current Bitcoin price.
      This happens on the backend so the
      frontend cannot manipulate the BTC amount.
    */

    const priceResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin",
          vs_currencies: "usd",
        },
        timeout: 30000,

        family: 4,
      }
    );

    const btcPrice =
      priceResponse.data?.bitcoin?.usd;

    if (!btcPrice) {
      throw new Error(
        "Bitcoin price unavailable"
      );
    }

    const expectedBtc =
      totalUsd / btcPrice;

    /*
      Store only 8 decimal places because
      Bitcoin uses satoshi precision.
    */

    const roundedBtc =
      Math.round(
        expectedBtc * 100000000
      ) / 100000000;

    const paymentStartedAt =
      new Date().toISOString();

    /*
      Create booking record in Supabase.
    */

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        name,
        email,
        phone,

        travellers,

        start_date: startDate || null,
        end_date: endDate || null,
        nights,
        days,

        selected_hotel: selectedHotel,
        selected_room: selectedRoom,
        selected_flight: selectedFlight,
        selected_car: selectedCar,
        selected_activities:
          selectedActivities,
        selected_package:
          selectedPackage,

        usd_total: totalUsd,
        expected_btc: roundedBtc,

        btc_address:
          BTC_RECEIVING_ADDRESS,

        payment_status: "pending",
        booking_status: "pending",

        payment_started_at:
          paymentStartedAt,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.json({
      success: true,

      bookingId: data.id,

      btcAddress:
        BTC_RECEIVING_ADDRESS,

      expectedBtc: roundedBtc,

      btcPrice,

      paymentStartedAt,
    });

  } catch (error) {

    console.error(
      "Create payment failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to create payment session",
    });
  }
});
app.listen(PORT, () => {

  console.log(
    `Havenway payment server running on port ${PORT}`
  );

});