var RestaurantData = require('../models/restaurants.server.model');
var SaveSplittedData = require('../models/splittedData.server.model');
var AccountData = require('../models/account.server.model');
var nodeExcel = require('excel-export');

exports.getAllData =  function(req, res){
	var query = RestaurantData.find();
	
	query.sort({restaurantName: 'asc'})
		.exec(function(err, result){
			if(err){
				return res.status(500).json({
					title: 'An error has occurred',
					error: err
				});
			}
			return res.status(200).json({
				title: 'Data Successfully Fetched',
				data: result
			});		
		});
}

exports.createNewData =  function(req, res){
	
	var newRestaurantEntry = new RestaurantData({
		restaurantName: req.body.restaurantName,
		restaurantAddress: req.body.restaurantAddress,
		foodMenu: req.body.foodMenu,
		drinksMenu: req.body.drinksMenu
	})
	
	newRestaurantEntry.save(function(err, result){
		if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				// Duplicate
				return res.status(500).send({ 
					title: 'Restaurant with same name and address already exists!' ,
					error: err
				});
			}
            return res.status(500).json({
                title: 'An error has occurred',
                error: err
            });
        }
		
		return res.status(200).json({
			title: 'Data Successfully Added',
			data: result
		});		
	})
}

exports.editData =  function(req, res){
	var condition = { _id: req.body._id };
	var updateData = {
		restaurantName: req.body.restaurantName,
		restaurantAddress: req.body.restaurantAddress,
		foodMenu: req.body.foodMenu,
		drinksMenu: req.body.drinksMenu
	}
	RestaurantData.findOneAndUpdate(condition, updateData, function (err, result)
	{
		if(err){
			return res.status(500).json({
				title: 'An error has occurred',
				error: err
			});
		}
		return res.status(200).json({
			title: 'Data Successfully Saved',
			data: result
		});	
	})
}

exports.fetchRestaurantNamesData =  function(req, res){
	var hintTest =  req.body.searchText;
	RestaurantData.find({'restaurantName': {'$regex': hintTest}}, function (err, result)
	{
		if(err){
			return res.status(500).json({
				title: 'An error has occurred',
				error: err
			});
		}
		
		var retData = []
		for(var i = 0; i< result.length; i++){
			var obj = { resName: result[i].restaurantName };
			retData.push(obj);
		}
		return res.status(200).json({	
			data: retData
		});	
	})
}

exports.getRestaurantMenuData =  function(req, res){
	RestaurantData.find({'restaurantName': req.body.resName}, function (err, result)
	{
		if(err){
			return res.status(500).json({
				title: 'An error has occurred',
				error: err
			});
		}			
		return res.status(200).json({	
			data: result[0]
		});	
	})
}


exports.saveSplitedData = function(req, res){
	var newSaveDataEntry = new SaveSplittedData({
		splitName: req.body.splitName,
		restautantName: req.body.restautantName,
		billDated: req.body.billDated,
		splitedData: req.body.splitedData,
		createdBy: req.body.createdBy
	})
	
	newSaveDataEntry.save(function(err, result){
		if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				// Duplicate
				return res.status(500).send({ 
					title: 'Same Split Name already exists!' ,
					error: err
				});
			}
            return res.status(500).json({
                title: 'An error has occurred',
                error: err
            });
        }
		
		return res.status(200).json({
			title: 'Data Successfully Saved',
			data: result
		});		
	})
}


exports.fetchSavedSplitData =  function(req, res){
	var query = SaveSplittedData.find({'createdBy': req.body.userName});
	query.sort({createdBy: 'asc'})
		.limit(20)
		.exec(function(err, result){
			if(err){
				return res.status(500).json({
					title: 'An error has occurred',
					error: err
				});
			}
			return res.status(200).json({
				title: 'Data Successfully Fetched',
				data: result
			});		
		});
}

exports.exportBiledData = function(req, res){
	var conf ={};
    conf.name = "bill-Sheet";
	conf.rows = JSON.parse(req.query.exportData);
	conf.cols = [{
		caption:'Name',
        type:'string',
        width:25
	},
	{
		caption:'Food Bill',
        type:'number',
        width:25
	},
	{
		caption:'Drink Bill',
        type:'number',
        width:25
	},
	{
		caption:'TotaL Bill',
        type:'number',
        width:25
	}];
	
  	var result = nodeExcel.execute(conf);
  	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  	res.end(result, 'binary');
	
}


exports.getUserGroups = function(req, res){
	AccountData.find({'userName': req.body.userName},function (err, result){
		if(err){
			return res.status(500).json({
				title: 'An error has occurred',
				error: err
			});
		}			
		return res.status(200).json({	
			data: result[0].userGroups
		});	
	})
}

exports.getAccountDetailsData = function(req, res){
	AccountData.find({'userName': req.body.userName},function (err, result)
	{
		if(err){
			return res.status(500).json({
				title: 'An error has occurred',
				error: err
			});
		}			
		return res.status(200).json({	
			data: result[0]
		});	
	})
}

exports.saveAccountDetailsData =  function(req, res){
	
	var condition = {'userName': req.body.userName};
	
	var newAccDataEntry = {
		userEmail: req.body.userEmail,
		userPassword: req.body.userPassword,
		userGroups: req.body.userGroups
	};
	
	AccountData.findOneAndUpdate(condition, newAccDataEntry, function(err, result){
		if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				// Duplicate
				var messageTitle = '';
				if(err.errmsg.indexOf('userEmail') >= 0){
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
                title: 'An error has occurred',
                error: err
            });
        }
		return res.status(200).json({
			title: 'Data Successfully Saved',
			data: result
		});		
	})
}
