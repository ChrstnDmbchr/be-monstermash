const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MashSchema = new Schema({
  users: {
    type: Array,
    required: true
  },
  phase: {
    type: String,
    required: true
  },
  imageData: {
    type: Array,
    required: true
  },
  votes: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('mash', MashSchema);