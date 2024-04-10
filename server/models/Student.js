const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  age: {
    type: String,
    required: 'This field is required.'
  },
  dob: {
    type: String,
    required: 'This field is required.'
  },
  yearofadmission: {
    type: String,
    required: 'This field is required.'
  },
});

module.exports = mongoose.model('Student', studentSchema);