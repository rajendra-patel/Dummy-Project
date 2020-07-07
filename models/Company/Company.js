const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let companySchema = new Schema({
    company_id: { type: String, unique: true },
    name: String,
    address_1: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone_number: String,
    facebook: String,
    instagram: String,
    featured_image: String,
    logo: String,
    short_url: String
});
companySchema.plugin(uniqueValidator, { message: 'company already in use.' });
module.exports = mongoose.model('Company', companySchema);