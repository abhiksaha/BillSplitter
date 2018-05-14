var express = require('express');
var router = express.Router();

var restaurantDataCtrl = require('../controllers/restaurants.server.controller');

router.get('/getAllRestaurantsData', function(req, res, next) {
  return restaurantDataCtrl.getAllData(req, res)
});

router.post('/addRestaurantData', function(req, res){
	return restaurantDataCtrl.createNewData(req, res);
})

router.post('/editRestaurantData', function(req, res){
	return restaurantDataCtrl.editData(req, res);
})

router.post('/fetchRestaurantNames', function(req, res){
	return restaurantDataCtrl.fetchRestaurantNamesData(req, res);
})

router.post('/getRestaurantMenu', function(req, res){
	return restaurantDataCtrl.getRestaurantMenuData(req, res);
})

router.get('/exportData', function(req, res){
	return restaurantDataCtrl.exportBiledData(req, res);
})

router.post('/saveSplitedData', function(req, res){
	return restaurantDataCtrl.saveSplitedData(req, res);
})

router.post('/fetchSavedSplitData', function(req, res){
	return restaurantDataCtrl.fetchSavedSplitData(req, res);
})

router.post('/getUserGroups', function(req, res){
	return restaurantDataCtrl.getUserGroups(req, res);
})

router.post('/saveAccountDetailsData', function(req, res){
	return restaurantDataCtrl.saveAccountDetailsData(req, res);
})

router.post('/getAccountDetailsData', function(req, res){
	return restaurantDataCtrl.getAccountDetailsData(req, res);
})
module.exports = router;
