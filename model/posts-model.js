const mongoose = require('mongoose')
const {Schema } = mongoose

const posts = new Schema({
            postId: String,
            postContent: String,
            numberOfLikes: String,
            numberOfShares: String,
            timeOfPost: String,
            postSentiment: String,
            comments: [
                {
                    commentContent: String,
                    commenterName: String,
                    commentorId: String,
                    commentSentiment: String
                }
            ],
            date: String

})

const Posts = mongoose.model('Posts', posts)

module.exports = Posts