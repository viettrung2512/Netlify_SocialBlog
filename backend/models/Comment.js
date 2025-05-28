const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like'
  }],

  likeCount: { 
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
