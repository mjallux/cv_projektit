import mongoose from 'mongoose'
import dotenv from 'dotenv'

module.exports.env = function() {
    dotenv.config()
}()

module.exports.connection = function() {
    mongoose.connect(
        `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@${ process.env.DB_URL }?retryWrites=true&w=majority`,
        { useNewUrlParser: true,
        useUnifiedTopology: true}
    )

    mongoose.connection.on('error', () => console.log("db: error connecting"))
    mongoose.connection.on('open', () => console.log("db: connection established"))
}()