const express = require('express');

const router = express.Router();


// @route GET api/posts
// @desc  TEST route
// @access public
router.get('/', (req,res)=>{
    res.send('posts Route')
})

module.exports = router;