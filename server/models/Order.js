const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
      },
      order: {
        type: String,
        required: 'This field is required.'
      },
      email: {
        type: String,
        required: 'This field is required.'
      },
});

module.exports = mongoose.model('Order', orderSchema);