var express = require('express');
var router = express.Router();

var userDataCtrl = require('../controllers/user.server.controller');

router.post('/signin', function(req, res, next) {
	return userDataCtrl.signin(req, res)
});
router.post('/signup', function(req, res, next) {
	return userDataCtrl.signup(req, res)
});
module.exports = router;
