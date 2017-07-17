var mongoose =require('mongoose');
var bcrypt  = require('bcrypt-nodejs');


var uniqueValidator = require('mongoose-unique-validator');



var ProductSchema = mongoose.Schema({
		userId: {type : String },
        providedByImage: {type : String},
        providedSocial: {type : String},
        website: {type : String},
        name: {type : String},
        summary: {type : String},
        highlights:{type : String},
		courses: {type : String},
		languages: {type : String},
		dates: {type : String},
		includes: {type : String},
		accommodation: {type : String},
		languageSkills: {type : String},
		experienceRequired: {type : String},
		mainImage: {type : String},
		images: {type : Array},
		video: {type : Array},
		views: {type : Number},
		rate: {type : Number},
		time : { type : Date, default: Date.now },	
});

ProductSchema.plugin(uniqueValidator);


var Product = module.exports = mongoose.model('Product' , ProductSchema);

