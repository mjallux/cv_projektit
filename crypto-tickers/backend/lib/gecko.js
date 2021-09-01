import util from 'util'

const state = require('../state.js')
const geckoAPI = "https://api.coingecko.com/api/v3";

function getCoins() {
  const geckoAll = "/coins/list?include_platform=false";
  return state.gecko.get(`${geckoAPI}${geckoAll}`);
}

async function getCoin(name) {
  const market = "/coins/%s/market_chart/range?vs_currency=usd&from=%s&to=%s"
  const coin = "/coins/%s?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false"
  
  let d1 = new Date()
  let d2 = new Date().setDate(new Date().getDate() - 7)

  let marketQuery = util.format(market, name, d2 / 1000, d1 / 1000)
  let coinQuery = util.format(coin, name)

  console.log("fetching: " + name)

  let marketData = await state.gecko.get(geckoAPI + marketQuery)

  let coinData = await state.gecko.get(geckoAPI + coinQuery)


  let imageUrl = coinData.data.image.large.split("?")[0]

  return {
    image: imageUrl,
    marketData: marketData.data
  }
}

module.exports = {
  getCoins, getCoin
}