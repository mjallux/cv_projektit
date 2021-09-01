import mongoose from 'mongoose'
const { Schema } = mongoose

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment