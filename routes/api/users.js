const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const User = require('../../models/user.model')

// @route GET api/users
// @desc  TEST route
// @access public
router.get('/', (req,res)=>{
    res.send('User Route')
})

// @route POST api/users
// @desc  register user
// @access public
router.post('/',[
        check('name','Name is required').not().isEmpty(),
        check('email','Please include a valid email').isEmail(),
        check('password','please enter a password with atleast 6 characters').isLength({min:6})
    ], 
    async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email, password} = req.body;

    try {
        // see if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg : 'user alreaddy exists'}]});
        }

        // Get user gravatar
            const avatar = gravatar.url(email,{
                "s":"200",
                r:"pg",
                d:"mm"
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

        // encrypt password
        const salt = await becrypt.genSalt(10);

        userr.password = await becrypt.hash(password, salt);
        await user.save();

        // return jsonWebToken

        console.log(req.body)
        res.send('User Registered')
        
    } catch (error) {
        console.log(erroe.message);
        res.status(500).send('server error')
    }
})



module.exports = router;