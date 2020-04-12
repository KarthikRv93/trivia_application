const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {
      type:String,
      required:true
  }
});

const categoryModel = mongoose.model('categoryModel', categorySchema);

module.exports = categoryModel;
