
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/user.model');

// @route GET api/users
// @desc  TEST route
// @access public
router.get('/', async (req,res)=>{
    try {
      const users = await User.find().sort({date: -1});
      res.send(users)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({msg:'server error'});
    }
})

// @route POST api/users
// @desc  register user
// @access public
router.post(
    '/',
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, password } = req.body;
  
      try {
          // see if user exists
        let user = await User.findOne({ email });
  
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }
  
        // Get user gravatar
        const avatar = normalize(
          gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          }),
          { forceHttps: true }
        );
  
        user = new User({
          name,
          email,
          avatar,
          password
        });
  
        // encrypt password
        const salt = await bcrypt.genSalt(10);
  
        user.password = await bcrypt.hash(password, salt);
  
        await user.save();
  
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
