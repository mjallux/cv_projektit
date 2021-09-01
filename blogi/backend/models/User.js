import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema } = mongoose
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const uuid = customAlphabet(alphabet, 8)

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
}, { timestamps: true })

UserSchema.pre('save', function() {
    this.slug = uuid()
})

UserSchema.pre('validate', async function() {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})



const User = mongoose.model('User', UserSchema)

module.exports = User