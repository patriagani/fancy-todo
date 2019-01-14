var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController')

router.post('/', AuthController.auth);


module.exports = router;
