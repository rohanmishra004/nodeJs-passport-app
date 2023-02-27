const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('welcome') //this will render the view in welcome.ejs inside views folder
})


module.exports = router