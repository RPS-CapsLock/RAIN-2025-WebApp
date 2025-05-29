var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'owner': { type: Boolean, default: false },
	'registered' : { type: Date, default: Date.now },
	'logs': [{
		'dateTime': { type: Date, default: Date.now }
	}]
});

userSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

userSchema.statics.authenticate = function(username, password, callback){
	User.findOne({ username: username })
	.exec(function(err, user){
		if(err){
			return callback(err);
		} else if(!user) {
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		} 

		bcrypt.compare(password, user.password, function(err, result){
			if(result === true){
				user.logs.push({ dateTime: new Date() });

				user.save(function(saveErr) {
					if(saveErr) return callback(saveErr);
					return callback(null, user);
				});
			} else {
				return callback();
			}
		});
	});
};

var User = mongoose.model('user', userSchema);
module.exports = User;
