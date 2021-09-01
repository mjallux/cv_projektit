import crypto from 'crypto'
import util from 'util'

const state = require('../state.js')

function gateSignature(method, url, queryString, payloadString) {
  const hmac = crypto.createHmac("sha512", state.keys.gate.secret);
  const hash = crypto.createHash("sha512");

  const timestamp = Math.floor(Date.now() / 1000).toString();

  const hashed = hash.update(encodeURIComponent(payloadString || '')).digest("hex");
  const sig = util.format("%s\n%s\n%s\n%s\n%s", method, url, queryString || '', hashed, timestamp)

  const signature = hmac.update(sig).digest("hex");

  const headers = { 
    KEY: state.keys.gate.key,
    Timestamp: timestamp,
    SIGN: signature
  };

  console.log

  return headers
}

function binanceSignature(queryString) {
  const signature =  crypto
    .createHmac("sha256", state.keys.binance.secret)
    .update(queryString)
    .digest("hex");

  return signature
}

module.exports = {
  gateSignature,
  binanceSignature
}