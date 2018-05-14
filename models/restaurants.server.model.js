var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
	itemName: { type: String, required: true},
	itemPrice: { type: String, required: true},
	isDiscountAvailable : { type: Boolean, default: false},
	createdOn : { type: Date, default: Date.now },
	createdBy : { type: String, default: 'Admin'}
})

var RestaurantDataSchema = new Schema({
	restaurantName : { type: String, required: true},
	restaurantAddress : { type: String, required: true},
	foodMenu: [ MenuSchema ],
	drinksMenu: [ MenuSchema ],
	createdOn : { type: Date, default: Date.now },
	createdBy : { type: String, default: 'Admin' },
})

RestaurantDataSchema.index({ restaurantName: 1, restaurantAddress: 1}, { unique: true });

module.exports = mongoose.model('RestaurantData', RestaurantDataSchema);