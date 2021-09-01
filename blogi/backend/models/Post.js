import mongoose from 'mongoose'
const { Schema } = mongoose
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const uuid = customAlphabet(alphabet, 8)

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    publishAt: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String,
        unique: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
}, { timestamps: true })

PostSchema.pre('save', function() {
    this.slug = uuid()
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post