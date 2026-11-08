const crypto = require("crypto");

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

function isValidBase58Address(address) {
  let value = 0n;
  for (const character of address) {
    const digit = BASE58_ALPHABET.indexOf(character);
    if (digit < 0) return false;
    value = value * 58n + BigInt(digit);
  }

  const decoded = value === 0n ? [] : Array.from(Buffer.from(value.toString(16).padStart(
    Math.ceil(value.toString(16).length / 2) * 2,
    "0",
  ), "hex"));
  const leadingZeros = address.match(/^1*/)?.[0].length || 0;
  const payload = Buffer.concat([Buffer.alloc(leadingZeros), Buffer.from(decoded)]);
  if (payload.length !== 25 || ![0x00, 0x05].includes(payload[0])) return false;

  const body = payload.subarray(0, 21);
  const checksum = payload.subarray(21);
  const firstHash = crypto.createHash("sha256").update(body).digest();
  const expectedChecksum = crypto.createHash("sha256").update(firstHash).digest().subarray(0, 4);
  return checksum.equals(expectedChecksum);
}

function bech32Polymod(values) {
  const generators = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;
  for (const value of values) {
    const top = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let index = 0; index < generators.length; index += 1) {
      if ((top >>> index) & 1) checksum ^= generators[index];
    }
  }
  return checksum >>> 0;
}

function convertBits(values, fromBits, toBits) {
  let accumulator = 0;
  let bitCount = 0;
  const result = [];
  const maxValue = (1 << toBits) - 1;
  for (const value of values) {
    if (value < 0 || value >>> fromBits) return null;
    accumulator = (accumulator << fromBits) | value;
    bitCount += fromBits;
    while (bitCount >= toBits) {
      bitCount -= toBits;
      result.push((accumulator >>> bitCount) & maxValue);
    }
  }
  if (bitCount >= fromBits || ((accumulator << (toBits - bitCount)) & maxValue)) return null;
  return result;
}

function isValidBech32Address(address) {
  if (address.length < 14 || address.length > 90) return false;
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;

  const normalized = address.toLowerCase();
  const separator = normalized.lastIndexOf("1");
  if (separator < 1 || separator + 7 > normalized.length) return false;
  if (normalized.slice(0, separator) !== "bc") return false;

  const data = [];
  for (const character of normalized.slice(separator + 1)) {
    const value = BECH32_ALPHABET.indexOf(character);
    if (value < 0) return false;
    data.push(value);
  }

  const hrpValues = [3, 3, 0, 2, 3];
  const polymod = bech32Polymod([...hrpValues, ...data]);
  const witnessVersion = data[0];
  if (witnessVersion > 16) return false;
  const checksumConstant = witnessVersion === 0 ? 1 : 0x2bc830a3;
  if (polymod !== checksumConstant) return false;

  const program = convertBits(data.slice(1, -6), 5, 8);
  if (!program || program.length < 2 || program.length > 40) return false;
  if (witnessVersion === 0 && ![20, 32].includes(program.length)) return false;
  return true;
}

function isValidBitcoinAddress(address) {
  if (typeof address !== "string" || address !== address.trim()) return false;
  if (address.startsWith("1") || address.startsWith("3")) return isValidBase58Address(address);
  if (address.toLowerCase().startsWith("bc1")) return isValidBech32Address(address);
  return false;
}

module.exports = { isValidBitcoinAddress };
