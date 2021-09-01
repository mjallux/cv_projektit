import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

const keys = {
  gate: {
    secret: process.env.GATEIO_API_SECRET,
    key: process.env.GATEIO_API_KEY
  },
  binance: {
    secret: process.env.BINANCE_API_SECRET,
    key: process.env.BINANCE_API_KEY
  }
}

const port = process.env.PORT || 8080

const gecko = rateLimit(axios.create(), { maxRPS: 1})

module.exports = {
  gecko,
  keys,
  port
}