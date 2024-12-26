const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  name: {type: String, required:true},
  date: { type: String, required: true },
  food: { type: String, required: true },
  calories: { type: Number, required: true },
});

module.exports = mongoose.model('Entry', EntrySchema);
