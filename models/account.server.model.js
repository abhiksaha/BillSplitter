var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupDataSchema =  new Schema({
	groupName: { type: String },
	groupMembers: { type: Array },
	createdOn: { type: Date, default: Date.now },
	createdBy: { type: String , required: true},
})

var AccountDataSchema = new Schema({
	userName: { type: String , required: true, unique: true},
	userEmail: { type: String , required: true, unique: true },
	userPassword: { type: String, required: true },
	userGroups : [ GroupDataSchema ]
})

GroupDataSchema.index({ createdBy: 1, groupName: 1}, { unique: true, sparse: true });

module.exports = mongoose.model('AccountData', AccountDataSchema);