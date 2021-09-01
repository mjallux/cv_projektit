import express from 'express'
import router from './routes/api.js'

const app = express()

app.use(express.json())

app.use('/api', router)

app.listen(3000, () => {
    console.log("Listeinng to port " + 3000)
})