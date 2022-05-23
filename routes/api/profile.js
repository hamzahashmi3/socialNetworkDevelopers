const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile.model');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { set } = require('mongoose');
const { response } = require('express');


// @route GET api/profile/me
// @desc  TEST route
// @access private
router.get('/me',auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'there is no profile for this user'});
        }
        res.json(profile);
    } catch (error){
        console.log(error.message)
        return res.status(500).json({msg:'server error'});
    }
})

// @route POST api/profile
// @desc  create & Update user profile
// @access private
router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({errors:error.array()})
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
    const profileFields = {}
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) profileFields.skills = skills.split(',').map(skills=>skills.trim());

    // Build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebok = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) social.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user:req.user.id})

        // Update user
        if(profile){
            profile = await profile.findOneAndUpdate({user:req.user.id}), {$set:profileFields}, {new : true};
            return response.json(profile);
        }

        // create user profile
        profile = new profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
})

module.exports = router;