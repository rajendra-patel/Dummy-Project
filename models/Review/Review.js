const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let reviewSchema = new Schema({
    coupon_id: String,
    name: String,
    email: String,
    phone: String,
    review: String,
    rating: String
});
reviewSchema.plugin(uniqueValidator, { message: 'Review id already in use.' });
module.exports = mongoose.model('Review', reviewSchema);
