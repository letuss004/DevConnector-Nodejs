const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check, validationResult, body} = require('express-validator')


// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Public
router.get(
    "/me",
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
                return res.status(400).json(
                    {msg: 'There is no profile for this user'}
                )
            }
            return res.json(profile)
        } catch (err) {
            console.log(err.message)
            console.log('------------------------------------------------------')
            res.status(500).send('Server error')
        }
        res.send("Profiles route");
    }
);


// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Public
router.post('/',
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skill is required').not().isEmpty(),
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(
                    {errors: errors.array()}
                );
        }

        const {
            website,
            company,
            location,
            bio,
            status,
            github_username,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;
        if (github_username) profileFields.github_username = github_username;
        if (skills) {
            profileFields.skills = skills.split(',').map(skills => skills.trim());
        }
        // Build profile object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({user: req.user.id});

            if (profile) {
                // update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                )

                return res.json(profile);
            }
            // if not => create one
            profile = new Profile(profileFields);
            await profile.save();

            return res.json(profile);
        } catch (err) {
            console.log(err.message)
            return res.status(500)
                .send('Server Error')
        }
    }
);

module.exports = router;