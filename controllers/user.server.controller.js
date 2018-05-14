var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var UserData = require('../models/account.server.model');

exports.signup =  function(req, res){
	var user = new UserData({
        userName: req.body.userName,
        userPassword: bcrypt.hashSync(req.body.password, 10),
        userEmail: req.body.email,
		userGroups: []
    });
    user.save(function(err, result) {
        if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				// Duplicate
				var messageTitle = '';
				if(err.errmsg.indexOf('userName') >= 0){
					messageTitle = 'Duplicate User Name already exists!' ;
				}else if(err.errmsg.indexOf('userEmail') >= 0){
					messageTitle = 'Duplicate Email ID already exists!' ;
				}else if(err.errmsg.indexOf('groupName') >= 0){
					messageTitle = 'Duplicate Group Name already exists!' ;
				}else{
					messageTitle = '';
				}
				return res.status(500).send({ 
					title: messageTitle ,
					error: err
				});
			}
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
		var token = jwt.sign({result: result}, 'secret', {expiresIn: 7200});
        res.status(201).json({
            title: 'User created',
            obj: result,
			token: token
        });
    });
}
exports.signin =  function(req, res){
	UserData.findOne({userName: req.body.userName}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.userPassword)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            title: 'Successfully logged in',
            token: token,
            userId: user._id,
			userName: user.userName
        });
    });
}