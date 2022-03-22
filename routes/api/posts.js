const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult, body} = require('express-validator')


// @route   POST api/posts
// @desc    Create a posts
// @access  Private
router.post(
    "/",
    auth,
    (req, res) => {

    }
);

module.exports = router;