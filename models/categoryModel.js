const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'name is required for a category!'],
  },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
