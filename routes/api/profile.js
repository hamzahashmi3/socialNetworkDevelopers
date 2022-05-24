const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile.model');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { set } = require('mongoose');
const { response } = require('express');
const res = require('express/lib/response');
const User = require('../../models/user.model');


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
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
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
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user:req.user.id})

        // Update user
        if(profile){
            profile = await profile.findOneAndUpdate({user:req.user.id}), {$set:profileFields}, {new : true};
            return res.json(profile);
        }

        // create user profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
})


    // @route GET api/profile
    // @desc  get all profiles
    // @access Public

    router.get('/', async(req, res)=>{
        try {
            const profiles = await Profile.find().populate('user', ['name', 'avatar']);
            res.send(profiles);
        }catch(err){
            console.log(err.message);4
            res.status(500).send('server error');;
        }
    })


        // @route    GET api/profile/user/:user_id
        // @desc     Get profile by user ID
        // @access   Public

    // router.get('/user/:user_id',checkObjectId('user_id'),async ({ params: { user_id } }, res) => {
    router.get('/user/:user_id', async(req,res)=>{
        try {
            const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);
    
            if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){ 
                return res.status(400).json({ msg : 'profile not found'});
            }
            return res.status(500).json({ msg: 'Server error' });
        }
        }
    );

        // @route DELETE api/profile
        // @desc  dlete user & profile & posts
        // @access Private

        router.delete('/',auth, async(req, res)=>{
            try {
                await Profile.findOneAndRemove({ user: req.user.id });
                await User.findByIdAndRemove({_id:req.user.id});
                res.send('user deleted');
            }catch(err){
                console.log(err.message);4
                res.status(500).send('server error');;
            }
        })



module.exports = router;