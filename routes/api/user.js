const express = require("express");
const router = express.Router();
const {check, validationResult, body} = require('express-validator')
const gravatar = require("gravatar")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require("../../models/User")


// @route   POST api/users
// @desc    Register user route, DON'T REQUIRE TO RESPONSE TOKEN, if necessary uncomment
// @access  Public
router.post(
    "/",
    body('email', 'Invalid email address').isEmail(),
    check('name', 'Name is required').not().isEmpty(),
    body('password', 'Password is required').isLength(
        {min: 6, max: 40}
    ),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
                {errors: errors.array()}
            );
        }

        let {email, name, password} = req.body;
        try {
            let user = await User.findOne({email});
            // if user exists
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            // Get users gravatar
            const avatar = gravatar.url(
                email,
                {
                    s: '200',
                    r: 'pg',
                    d: 'mm',
                }
            )
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            // Create and save user
            user = new User({
                name,
                email,
                avatar,
                password,
            });
            await user.save();
            // Return JWT
            const payload = {
                user: {
                    id: user.id,
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err, token) => {
                    if (err) throw err;
                    return res.json({token})
                }
            );
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;