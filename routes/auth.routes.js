const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User/User");
const companySchema = require("../models/Company/Company");
const couponSchema = require("../models/Coupon/Coupon");
const reviewSchema = require("../models/Review/Review");
const multer = require('multer');
const upload = multer();

const authorize = require("../auth/auth");
const { check, validationResult } = require('express-validator');

router.post("/signin", (req, res, next) => {
    let getUser;
    console.log("inside signing");
    console.log("signinhit with"+req.body.password)
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {        // No User Found
            console.log("No User");
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        console.log(user);
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        console.log("Inside Response");
        // console.log(response);

        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "secret", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
});

// Get All Users
router.route('/users').get(authorize, (req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get User
router.route('/user').get(authorize, (req, res, next) => {
    userSchema.findById(req.query.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Update User
router.route('/update/user').put(authorize, (req, res, next) => {
    console.log(req.query);
    userSchema.findByIdAndUpdate(req.query.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
});


// Delete User
router.route('/delete/user').delete(authorize, (req, res, next) => {
    console.log(req.query);
    userSchema.findByIdAndRemove(req.query.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Registering User Disabled For Now

router.post("/register-user", (req, res, next) => {
    console.log(req.body.name);
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userSchema({
            name: req.body.name,
            password: hash,
            email: req.body.email,
            role: req.body.role
        });
        user.save().then((response) => {
            res.status(201).json({
                message: "User successfully created!",
                result: response
            });
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
    });
});


// Test Postman File

router.post("/test-postman", upload.single('logo'), (req, res, next) => {
    let file = req.file;
    console.log(file.originalname);
    console.log(file.mimetype);

    let encodedImage = file.buffer.toString('base64');

    res.status(201).json({
        imageBase64: encodedImage
    });;

});

router.route("/register-company").post( authorize, upload.single('logo'), (req, res, next) => {
    // let logo = req.file;
    // let encodedImage = logo.buffer.toString('base64');

    const company = new companySchema({
        company_id: req.body.company_id,
        name: req.body.name,
        address_1: req.body.address_1,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        phone_number: req.body.phone_number,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        featured_image: req.body.featured_image,
        logo: req.body.logo,
        short_url: req.body.short_url
    });
    company.save().then((response) => {
        res.status(201).json({
            message: "Company successfully created!",
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

// Get All Companies
router.route('/companies').get((req, res) => {
    companySchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Company
router.route('/company').get(authorize, (req, res, next) => {
    let getCompany;
    companySchema.findOne({
        company_id: req.query.id
    }).then(company => {
        if (!company) {        // No Company Found
            return res.status(401).json({
                message: "Invalid Company Id"
            });
        } else {
            res.status(200).json(company);
        }
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
});

// Update Company
router.route('/update/company').put(authorize, (req, res, next) => {
    companySchema.findOneAndUpdate({company_id: req.query.id}, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data)
            console.log('Company successfully updated!')
        }
    })
});


// Delete Company
router.route('/delete/company').delete(authorize, (req, res, next) => {
    console.log(req.query.id);
    companySchema.findOneAndRemove({company_id: req.query.id}, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Coupon

// Create Coupon
router.route("/create-coupon").post( authorize, upload.single('image'), (req, res, next) => {
    // let image = req.file;
    // let encodedImage = image.buffer.toString('base64');
    const coupon = new couponSchema({
        description: req.body.description,
        is_redeemable_once: req.body.is_redeemable_once,
        reredemption_wait_time: req.body.reredemption_wait_time,
        has_expiration_date: req.body.has_expiration_date,
        expiration_date: new Date(req.body.expiration_date),
        disable_vote: req.body.disable_vote,
        coupon_colorway: req.body.coupon_colorway,
        facebook_pixel_id: req.body.facebook_pixel_id,
    
        header: req.body.header,
        offer_image: req.body.offer_image,
        offer: req.body.offer,
        offer_description: req.body.offer_description,
        redeem_button_text: req.body.redeem_button_text,
        vote_up_button_text: req.body.vote_up_button_text,
        vote_down_button_text: req.body.vote_down_button_text,
        fineprint: req.body.fineprint,
        
        show_call_link: req.body.show_call_link,
        call_number: req.body.call_number,
        show_website_link: req.body.show_website_link,
        website_address: req.body.website_address,
        show_facebook_link: req.body.show_facebook_link,
        facebook_url: req.body.facebook_url,
        show_instagram_link: req.body.show_instagram_link,
        instagram_url: req.body.instagram_url,
        show_direction_link: req.body.show_direction_link,
        direction_url: req.body.direction_url,
    
        redemption_type: req.body.redemption_type,
        redemption_action:	req.body.redemption_action,
        show_redemption_timer: req.body.show_redemption_timer,
    
        //Standard Options
        redemption_code: req.body.redemption_code,
    
        //BarcodeOptions
        barcode_format: req.body.barcode_format,
    
        //Image
        redemption_image: req.body.redemption_image,
        
        //redirect noinherit
        redirect_url: req.body.redirect_url,

        name: req.body.name,
        image: req.body.image,
        company_id: req.body.company_id,
        // color_theme: req.body.color_theme,
        redemption_count: req.body.redemption_count,
        like_count: req.body.like_count,
        dislike_count: req.body.dislike_count,
        short_url: req.body.short_url
    });
    coupon.save().then((response) => {
        res.status(201).json({
            message: "Coupon successfully created!",
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

// Get All Coupons
router.route('/coupons').get(authorize, (req, res) => {
    couponSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get company Coupons
router.route('/company/:id/coupons').get(authorize, (req, res) => {
    couponSchema.find({ company_id : req.params.id }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Update Vote / redeemed public
router.route('/update/coupon/public').put((req, res, next) => {
    couponSchema.findByIdAndUpdate(req.query.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data)
            console.log('Coupon successfully updated!')
        }
    })
});

// Get coupon
router.route('/coupon').get((req, res, next) => {
    couponSchema.findById(req.query.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Update coupon
router.route('/update/coupon').put(authorize, (req, res, next) => {
    couponSchema.findByIdAndUpdate(req.query.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data)
            console.log('Coupon successfully updated!')
        }
    })
});


// Delete coupon
router.route('/delete/coupon').delete(authorize, (req, res, next) => {
    couponSchema.findByIdAndRemove(req.query.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Review

// Create a Review
router.route("/create-review").post(authorize, (req, res, next) => {
    const review = new reviewSchema({
        coupon_id: req.query.coupon_id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        review: req.body.review,
        rating: req.body.rating
    });
    review.save().then((response) => {
        res.status(201).json({
            message: "Review successfully created!",
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

// Get All Reviews
router.route('/reviews').get((req, res) => {
    reviewSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get review
router.route('/review').get(authorize, (req, res, next) => {
    reviewSchema.findById(req.query.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

// Update review
router.route('/update/review').put(authorize, (req, res, next) => {
    reviewSchema.findByIdAndUpdate(req.query.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data)
            console.log('Review successfully updated!')
        }
    })
});


// Delete review
router.route('/delete/review').delete(authorize, (req, res, next) => {
    reviewSchema.findByIdAndRemove(req.query.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
});

module.exports = router;