const mongoose = require('mongoose')

const SavedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  saved_content: {
    type: String,
    required: false
  },
  save_sender: {
    type: String,
    required: false
  },
  original_content_sender: {
    type: String,
    required: false
  },
  original_content: {
    type: String,
    required: false
  },
  tags: [String],
  extras: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

const Saved = mongoose.models.Saved || mongoose.model('Saved', SavedSchema)
module.exports = Saved
