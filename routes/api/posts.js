const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const router = express.Router();


// @route GET api/posts
// @desc  TEST route
// @access public
router.get('/', (req,res)=>{
    res.send('posts Route')
})


module.exports = router;