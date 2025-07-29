const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);