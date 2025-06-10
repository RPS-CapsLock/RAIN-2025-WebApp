var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
  	'_2FA' : { type: Boolean, default: false},
	'fcmToken' : { type: String, default: ""},
	'owner': { type: Boolean, default: false },
	'registered' : { type: Date, default: Date.now },
	'logs': [{
		'dateTime': { type: Date, default: Date.now }
	}]
});

userSchema.pre('save', function(next){
	var user = this;
	if (!user.isModified('password')) return next();

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
			if(err) return callback(err);

			if(result === true){
				user.logs.push({ dateTime: new Date() });
				user.save(function(saveErr){
					if(saveErr) return callback(saveErr);
					return callback(null, user);
				});
			} else{
				var err = new Error("Incorrect password.");
				err.status = 401;
				return callback(err);
			}
		});
	});
};

userSchema.statics.authenticateAsync = async function(username, password) {
    const user = await this.findOne({ username }).exec();
    if (!user) throw new Error("User not found");

    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new Error("Incorrect password");

    return user;
};

var User = mongoose.model('user', userSchema);
module.exports = User;
