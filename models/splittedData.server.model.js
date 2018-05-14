var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemDataSchema =  new Schema({
	itemName: { type: String },
	itemValue: { type: String },
	type: { type: String }
})

var SplittedDataSchema = new Schema({
	name: { type: String },
	dinksDataArr: [ ItemDataSchema ],
	foodDataArr: [ ItemDataSchema ],
	totalDataArr : [ ItemDataSchema ]
})

var SaveSplitDataSchema = new Schema({
	splitName : { type: String, unique: true},
	restautantName : { type: String},
	billDated: { type: String },
	splitedData: [ SplittedDataSchema ],
	createdOn : { type: Date, default: Date.now },
	createdBy : { type: String, default: 'Admin' }
})

module.exports = mongoose.model('SaveSplitData', SaveSplitDataSchema);