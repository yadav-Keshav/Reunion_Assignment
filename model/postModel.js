const mongoose = require('mongoose')
const User=require('./userModel');
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    desc: {
        type: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" }
    }],
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Post", postSchema);