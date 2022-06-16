const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/user.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

// @route GET api/auth
// @desc  get one user by token
// @access public
router.get('/', auth, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('--password')
        res.json(user)
    }catch(error){
        console.log(error.message);
        res.status(500).send('server Error')
    }
})

// @route POST api/auth
// @desc  Authenticate user & get token
// @access public
router.post(
    '/',
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password'
    ).exists(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {email, password } = req.body;
  
      try {
          // see if user exists
        let user = await User.findOne({ email });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid crediantials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
                return res
                .status(400)
                .json({error:[{msg:'Invalid crediantials'}]})
        }
  
        // return jsonWebToken
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;