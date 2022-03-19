const express = require("express");
const router = express.Router();
const {check, validationResult, body} = require('express-validator')
const gravatar = require("gravatar")
const bcrypt = require('bcryptjs')
const User = require("../../models/User")

// @route   POST api/users
// @desc    Register user route
// @access  Public
router.post(
    "/",
    body('email', 'Invalid email address').isEmail(),
    check('name', 'Name is required').not().isEmpty(),
    body('password', 'Password is required').isLength(
        {min: 6, max: 12}
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
            res.send("User registered");
        } catch
            (err) {

        }
    }
)
;

module.exports = router;