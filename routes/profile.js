const express = require('express');

const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth')
const User = require('../model/user');
const Profile = require('../model/profile')
const { check, validationResult } = require('express-validator/check');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get('/me', auth, async (req, res) => {
    console.log(req.user.id)
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', ['name', 'avatar']
        )
        console.log(profile)

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).send('Server Error');
    }
})

router.post(
    '/profile',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {

            //OR
            //  let Profile=await Profile.findOne({user:req.user.id});
            //  if(profile){
            //     let profile = await Profile.findOneAndUpdate(
            //         { user: req.user.id },
            //         { $set: profileFields }

            //     );
            //  }
            // Using upsert option (creates new doc if no match is found):
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true }
            );
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);



// @route    GET api/profile/user/:user_id
// @desc     Get all users profile
// @access   Private

router.get('/profile/:user_id', async (req, res) => {
    try {
        const profile = await Profile.find({ user: req.params.user_id }).populate('user', ['name', 'avatart'])
        if (!profile) return res.status(400).json({ msg: 'Profile Not Found' })
        res.status(200).json({ profile })
    } catch (err) {
        console.log(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not Found' })
        }
        res.status(500).send('Server Error')
    }
})


// @route    GET api/profile
// @desc     Get single users profile
// @access   Private

router.get('/profiles', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatart'])
        res.status(200).json({ profiles })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})


router.get('/profile', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatart'])
        res.status(200).json({ profiles })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }

})

// @route   DELETE api/profile
// @desc   Delete profile ,user & posts
// @access   Private

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.status(200).json({ msg: 'User deleted' })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})








module.exports = router