const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true,
    minlength: 3
  },
  profilePic: {
    type: String
  },
  post: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  likes: [
    {
      userId: {
        type: String
      },
      postId: {
        type: String
      }
    }
  ],
  shares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [
    {
      userId: {
        type: String
      },
      userName: {
        type: String
      },
      profilePic: {
        type: String
      },
      comment: {
        type: String
      },
      commentdate: {
        type: Date,
        default: Date.now
      },
      reply: [
        {
          userId: {
            type: String
          },
          userName: {
            type: String
          },
          profilePic: {
            type: String
          },
          comment: {
            type: String
          },
          commentdate: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ]
});
module.exports = mongoose.model("posts", PostSchema);
