const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Public
router.get(
    "/",
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne(
                {user: req.user.id}
            ).populate(
                'user',
                ['name', 'avatar'],
            );

            if (!profile) {

            }
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server error')
        }
        res.send("Profiles route");
    }
);

module.exports = router;