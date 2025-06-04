var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'_2FA' : { type: Boolean, default: false}
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
	User.findOne({username: username})
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
				return callback(null, user);
			} else{
				return callback();
			}
		});
		 
	});
}

userSchema.statics.authenticateAsync = async function(username, password) {
    const user = await this.findOne({ username }).exec();
    if (!user) throw new Error("User not found");

    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new Error("Incorrect password");

    return user;
};

var User = mongoose.model('user', userSchema);
module.exports = User;
