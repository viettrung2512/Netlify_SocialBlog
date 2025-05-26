const mongoose = require('mongoose');

const userHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['view_post', 'create_post', 'comment', 'like'],
  },
  details: {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    description: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserHistory', userHistorySchema);