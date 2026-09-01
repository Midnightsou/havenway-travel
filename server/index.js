const crypto = require("crypto");

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

          payment_link_used: true,

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

    const paymentToken =
      crypto.randomBytes(32).toString("hex");

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

        payment_token:
          paymentToken,

        payment_link_used:
          false,

        payer_name:
          name,

        payer_email:
          email,

        payer_phone:
          phone,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.json({
      success: true,

      bookingId: data.id,

      paymentToken,

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
// Get a shared booking/payment link
app.get("/api/payment-link/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Payment token is required",
      });
    }

    let booking = null;

    /*
     * First try the value as a database booking ID.
     *
     * This supports links like:
     *
     * /pay/02f55014-9202-4766-be6e-fa76c4705531
     */

    const { data: bookingById, error: idError } =
      await supabase
        .from("bookings")
        .select("*")
        .eq("id", token)
        .maybeSingle();

    if (idError) {
      console.error(
        "Booking ID lookup failed:",
        idError.message
      );
    }

    if (bookingById) {
      booking = bookingById;
    }


    /*
     * If no booking was found by ID,
     * try the secret payment token.
     *
     * This supports older links such as:
     *
     * /pay/<paymentToken>
     */

    if (!booking) {
      const {
        data: bookingByToken,
        error: tokenError,
      } = await supabase
        .from("bookings")
        .select("*")
        .eq("payment_token", token)
        .maybeSingle();

      if (tokenError) {
        console.error(
          "Payment token lookup failed:",
          tokenError.message
        );
      }

      if (bookingByToken) {
        booking = bookingByToken;
      }
    }


    /*
     * Nothing matched.
     */

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Payment link not found",
      });
    }


    /*
     * Once payment has been completed,
     * the shared payment link cannot be reused.
     */

    if (
      booking.payment_link_used ||
      booking.payment_status === "confirmed"
    ) {
      return res.status(410).json({
        success: false,
        error:
          "This payment link has already been used",
        expired: true,
      });
    }


    /*
     * Return only the information the
     * shared payment page needs.
     */

    return res.json({
      success: true,

      booking: {
        id: booking.id,

        travellers:
          booking.travellers,

        startDate:
          booking.start_date,

        endDate:
          booking.end_date,

        nights:
          booking.nights,

        days:
          booking.days,

        selectedHotel:
          booking.selected_hotel,

        selectedRoom:
          booking.selected_room,

        selectedFlight:
          booking.selected_flight,

        selectedCar:
          booking.selected_car,

        selectedActivities:
          booking.selected_activities,

        selectedPackage:
          booking.selected_package,

        usdTotal:
          Number(booking.usd_total),

        expectedBtc:
          Number(booking.expected_btc),

        btcAddress:
          booking.btc_address,

        paymentStatus:
          booking.payment_status,

        traveler: {
          name:
            booking.name || "",

          email:
            booking.email || "",

          phone:
            booking.phone || "",
        },
      },
    });

  } catch (error) {

    console.error(
      "Payment link lookup failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to load payment link",
    });
  }
});

// Update traveler/payer information on a shared booking
app.patch("/api/payment-link/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        error:
          "First name, last name, email and phone are required",
      });
    }

    const { data: booking, error: findError } =
      await supabase
        .from("bookings")
        .select("id, payment_status, payment_link_used")
        .or(
          `payment_token.eq.${token},id.eq.${token}`
        )
        .single();

    if (findError || !booking) {
      return res.status(404).json({
        success: false,
        error: "Payment link not found",
      });
    }

    if (
      booking.payment_link_used ||
      booking.payment_status === "confirmed"
    ) {
      return res.status(410).json({
        success: false,
        error: "This payment link has already been used",
        expired: true,
      });
    }

    const fullName =
      `${firstName} ${lastName}`.trim();

    const { error: updateError } =
      await supabase
        .from("bookings")
        .update({
          name: fullName,
          email,
          phone,

          payer_name: fullName,
          payer_email: email,
          payer_phone: phone,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", booking.id);

    if (updateError) {
      throw updateError;
    }

    return res.json({
      success: true,
      message:
        "Booking information updated successfully",
    });
  } catch (error) {
    console.error(
      "Payment link update failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to update booking information",
    });
  }
});

// Get the existing Bitcoin payment session for a booking
app.get("/api/payment-session/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: "Booking ID is required",
      });
    }

    const { data: booking, error } =
      await supabase
        .from("bookings")
        .select(`
          id,
          payment_token,
          btc_address,
          expected_btc,
          usd_total,
          payment_started_at,
          payment_status,
          payment_link_used
        `)
        .eq("id", bookingId)
        .single();

    if (error || !booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    if (
      booking.payment_link_used ||
      booking.payment_status === "confirmed"
    ) {
      return res.status(410).json({
        success: false,
        error: "This payment session has already been used",
        expired: true,
      });
    }

    if (!booking.payment_token) {
      return res.status(400).json({
        success: false,
        error: "Payment session is missing a payment token",
      });
    }

    if (!booking.btc_address) {
      return res.status(400).json({
        success: false,
        error: "Bitcoin address is missing",
      });
    }

    if (
      !Number.isFinite(Number(booking.expected_btc)) ||
      Number(booking.expected_btc) <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid Bitcoin payment amount",
      });
    }

    return res.json({
      success: true,

      paymentSession: {
        bookingId: booking.id,

        paymentToken:
          booking.payment_token,

        btcAddress:
          booking.btc_address,

        btcAmount:
          Number(booking.expected_btc),

        paymentStartedAt:
          booking.payment_started_at,

        paymentStatus:
          booking.payment_status,
      },
    });

  } catch (error) {

    console.error(
      "Payment session lookup failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to load payment session",
    });
  }
});

app.listen(PORT, () => {

  console.log(
    `Havenway payment server running on port ${PORT}`
  );

});