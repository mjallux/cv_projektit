import express from 'express'
import router from './routes/api/api.js'

const state = require('./state.js')

const app = express()

app.use('/api', router)

app.listen(state.port, () => {
  console.log(`Server running on port ${state.port}.`)
})
