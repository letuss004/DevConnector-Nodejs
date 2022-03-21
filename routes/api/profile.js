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
            res.status(500).send('Server error')
        }
        res.send("Profiles route");
    }
);


// @route   GET api/profiles
// @desc    Get all profiles
// @access  Public
router.get(
    '/',
    async (req, res) => {
        try {
            const profiles = await Profile.find()
                .populate(
                    'user',
                    ['name', 'avatar']
                );

            res.json(profiles);
        } catch (err) {
            console.log(err.message)
            return res.status(500)
                .send('Server Error')
        }
    }
);


// @route   GET api/profile/user/{user_id}
// @desc    Get specific profile by email
// @access  Public
// @note:   Correct version is find by id. See udemy 18-11:00.
router.get(
    '/user/:email',
    async (req, res) => {
        try {
            const profiles = await Profile.findOne({email: req.params.email})
                .populate(
                    'user',
                    ['name', 'avatar']
                );

            if (!profiles)
                return res.status(400)
                    .json(
                        {msg: "There is no profile"}
                    );

            return res.json(profiles);
        } catch (err) {
            console.log(err.message)
            return res.status(500)
                .send('Server Error')
        }
    }
);


// @route   POST api/profile/
// @desc    Create or update a profile
// @access  Private
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


// @route   POST api/profile/
// @desc    Create or update a profile
// @access  Private
router.delete(
    '/',
    auth,
    async (req, res) => {
        try {
            // todo: remove user posts
            // remove profile
            await Profile.findOneAndRemove(
                {user: req.user.id}
            );
            // Remove User
            await User.findOneAndRemove(
                {_id: req.user.id}
            );

            return res.json(
                {msg: 'User deleted'}
            );
        } catch (err) {
            console.log(err.message)
            return res.status(500)
                .send('Server Error');
        }
    }
);


// @route   POST api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
    '/experience',
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400)
                .json(
                    {errors: errors.array()}
                );

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        // fixme: why the above don't simply use this syntax ???
        const newExperience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };
        console.log(newExperience);

        try {
            const profile = await Profile.findOne(
                {user: req.user.id}
            );
            profile.experiences.unshift(newExperience);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.log(err.message);
            return res.status(500)
                .json(
                    {errors: "Server error"}
                );
        }
    }
);


module.exports = router;