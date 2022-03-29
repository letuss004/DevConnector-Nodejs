const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check, validationResult, body} = require('express-validator')
const request = require('request')
const config = require('config')


// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Public
router.get(
    "/me",
    auth,
    async (req, res) => {
        console.log('/me accepted');
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
                );
            }
            return res.json(profile);
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server error')
        }
    }
);


// @route   GET api/profile
// @desc    Get all profile
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

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({msg: 'Profile not found'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});

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


// @route   DELETE api/profile/
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


// @route   delete api/profile/experience
// @desc    Delete profile experience
// @access  Private
router.delete(
    '/experience/:id',
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne(
                {user: req.user.id}
            );
            // Get removed index
            const removedIndex = profile.experiences
                .map(
                    item => item.id
                ).indexOf(
                    req.params.id,
                );

            profile.experiences.splice(removedIndex, 1);
            await profile.save();

            return res.json(profile);
        } catch (err) {
            console.log(err.message);
            return res.status(500)
                .json(
                    {errors: "Server error"}
                );
        }
    }
);


// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({user: req.user.id});

            profile.education.unshift(newEdu);
            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   delete api/profile/education
// @desc    Delete profile education
// @access  Private
router.delete(
    '/education/:id',
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne(
                {user: req.user.id}
            );
            // Get removed index
            const removedIndex = profile.education
                .map(
                    item => item.id
                ).indexOf(
                    req.params.id,
                );

            profile.education.splice(removedIndex, 1);
            await profile.save();

            return res.json(profile);
        } catch (err) {
            console.log(err.message);
            return res.status(500)
                .json(
                    {errors: "Server error"}
                );
        }
    }
);


// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get(
    '/github/:username',
    async (req, res) => {
        try {
            const options = {
                uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
                method: 'GET',
                headers: {'user-agent': 'node.js'}
            };
            console.log(options.uri);

            request(
                options,
                (err, response, body) => {
                    if (err) console.error(err);
                    if (response.statusCode !== 200)
                        return res.status(404)
                            .json(
                                {msg: "No Github profile found"}
                            );

                    return res.json(JSON.parse(body));
                }
            );
        } catch (err) {
            console.error(err.message);
            return res.status(500)
                .json(
                    {errors: "Server error"}
                );
        }
    }
);


module.exports = router;