const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let couponSchema = new Schema({
    name: String,
    /*new*/
    description: String,
    is_redeemable_once: Boolean,
    reredemption_wait_time: Number,
    has_expiration_date: Boolean,
    expiration_date: Date,
    disable_vote: Boolean,
    coupon_colorway: String,
    facebook_pixel_id: String,

    header: String,
	offer_image: String,
	offer: String,
	offer_description: String,
	redeem_button_text: String,
	vote_up_button_text: String,
	vote_down_button_text: String,
    fineprint: String,
    
    show_call_link: Boolean,
    call_number: String,
	show_website_link: Boolean,
	website_address: String,
	show_facebook_link: Boolean,
	facebook_url: String,
	show_instagram_link: Boolean,
	instagram_url: String,
	show_direction_link: Boolean,
    direction_url: String,

    redemption_type: String,
	redemption_action:	String,
	show_redemption_timer: Boolean,

	//Standard Options
	redemption_code: String,

	//BarcodeOptions
	barcode_format: String,

	//Image
	redemption_image: String,
	
	//redirect noinherit
	redirect_url: String,

    image: String,
    company_id: String,
    // color_theme: String,
    redemption_count: Number,
    like_count: Number,
    dislike_count: Number,
    short_url: String

});
couponSchema.plugin(uniqueValidator, { message: 'Coupon already in use.' });
module.exports = mongoose.model('Coupon', couponSchema);