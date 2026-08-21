const https = require("https");

https.get(
  "https://blockstream.info/api/address/bc1qnr8l9grr2y3k062qqrykcpeeusy90rnm9e47tn/txs",
  (res) => {
    console.log("Status:", res.statusCode);

    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log(data.substring(0, 500));
    });
  }
).on("error", (error) => {
  console.error("NODE ERROR:", error.message);
  console.error("CODE:", error.code);
});