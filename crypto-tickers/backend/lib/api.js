import { gateSignature, binanceSignature } from './crypto.js'
import { getCoin, getCoins } from './gecko.js'
import axios from 'axios'

const state = require('../state.js')

async function portfolioData() {
  const binanceAPI = "https://api.binance.com";
  // const binanceEndpoint = "/sapi/v1/accountSnapshot";
  const binanceEndpoint = "/sapi/v1/capital/config/getall"
  const gateAPI = "https://api.gateio.ws";
  const gateEndpoint = "/api/v4/spot/accounts";

  let data = {
    gate: [],
    binance: [],
    combined: [],
  };

  let binanceRequestData = {
    queryString: `type=SPOT&timestamp=${Date.now()}`,
  }
  binanceRequestData.requestString =
      `?${binanceRequestData.queryString}&signature=${binanceSignature(binanceRequestData.queryString)}`

  const binanceRequest = {
    method: "GET",
    url: binanceAPI + binanceEndpoint + binanceRequestData.requestString,
    headers: { "X-MBX-APIKEY": state.keys.binance.key },
  };

  const gateRequest = {
    method: "GET",
    url: `${gateAPI}${gateEndpoint}`,
    headers: gateSignature("GET", gateEndpoint, "", ""),
  };


  try {
    let binanceData = await axios(binanceRequest)


    binanceData.data.filter((x) => {
      return parseFloat(x.free) > 0 || parseFloat(x.locked) > 0 && !isLegalMoney
    })
    .forEach((x) => {
      data.binance.push({
        symbol: x.coin,
        name: x.name,
        balance: parseFloat(x.free) + parseFloat(x.locked),
        exchange: 'binance'
      })
    })

    let gateData = await axios(gateRequest)
  
    gateData.data.forEach((x) => {
      data.gate.push({
        symbol: x.currency,
        balance: parseFloat(x.available),
        exchange: 'gate'
      })
    });
    
  } catch (error) {
    console.log(`[Error: HTTP/${error.response.status}]: ${error.response.data.message}`)
  }

  if(data.binance.length > 0 && data.gate.length > 0) {
    console.log("Fetched exchange data")
  }

  return {
    data: [...data.binance, ...data.gate]
  }
}

async function transform(data) {

  const coins = await getCoins()

  // filter all coins from coingecko with portfolio data using symbol value
  // ary = portfolio [...symbols] array, ['ETH', 'BTC', 'ADA']

  let ary = Object.values(data.data).map((el, i, ar) => ar[i] = el.symbol.toUpperCase())

  let filtered = coins.data.filter((x) => {
    return ary.includes(x.symbol.toUpperCase()) || x.id == 'bit_financial' || x.id == 'bitcoin-free-cash'
  })

  // add coin id and name to portfolio data

  data.data.forEach((i, idx, ar) => {
    filtered.forEach(j => {
      if (i.symbol.toUpperCase() === j.symbol.toUpperCase()) {
        Object.assign(ar[idx], { id: j.id, name: j.name })
      }
    })
  })

  console.log("filtered coins")

  // filter out undefined data, only e.g. binance leverage tokens & fiat currencies
  // --> data iteration: get coin data
  // {imageurl: coingecko.imgurl, labels: [...labels], prices: [...prices]} etc etc
  // timespan change: adjust number in d2.

  data = data.data
    .filter((x) => {
      return x.id !== undefined && x.balance > 0
    })
    .map(async (x, _, arr) => {
      try {
        let coinData = await getCoin(x.id)

        let returnData = {
          id: x.id,
          name: x.name,
          symbol: x.symbol,
          amount: x.balance,
          imageUrl: coinData.image,
          marketData: coinData.marketData,
          balance: x.balance * coinData.marketData.prices.pop()[1].toFixed(2),
          exchange: x.exchange,
        }
        console.log('name: ' + returnData.name + ' amount:\t' + returnData.balance)

        return returnData

      } catch (error) {
          console.log(error)
        console.log(`[Error: HTTP/${error.response.status}]: ${error.response.data.message}`)
      }
    })
    data.sum = data.forEach(el => data.sum += el.balance)
    
  Promise.all(data).then(() => {
    console.log("completed")
    console.log(data.sum)
    return data
  })
}

module.exports = {
  portfolioData,
  transform,
}