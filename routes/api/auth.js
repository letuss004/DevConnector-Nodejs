const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const {check, validationResult, body} = require('express-validator')
const gravatar = require("gravatar");


// @route   GET api/auth
// @desc    Auth route, as I mean it log in route, not require an auth(), if necessary uncomment
// @access  Public
router.post(
    "/",
    body('email', "Invalid email").isEmail(),
    body('password', "Invalid password").exists(),
    // auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({errors: errors.array()});
        }

        let {email, password} = req.body;
        try {
            const user = await User.findOne({email});
            // if user not exists
            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid credentials',
                    }]
                });
            }
            // if credentials not valid
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({errors: {msg: "Invalid credentials"}})
            }
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
                    res.json({token})
                }
            );
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;