import express from 'express'
import { portfolioData, transform } from '../../lib/api.js'
import { getCoin } from '../../lib/gecko.js'

const router = express.Router()

router.get('/portfolio', async (req, res ) => {
  /*
    get balances from exchange walets -> 
    get symbol, name, image, prices   ->
    transform to array of objects
  */

  let portfolio = await portfolioData()
  let transformed = await transform(portfolio)

  res.send(transformed)
})

router.get('/coin/:coin', async (req, res) => {
  let coin = await getCoin(req.params.coin)
  console.log(coin.data)
  res.send(coin)
})

module.exports = router
