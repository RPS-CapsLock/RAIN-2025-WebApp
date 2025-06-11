var UserModel = require('../models/userModel.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const admin = require('../firebase');

//const PyAPI = "http://localhost:5000"
const PyAPI = "http://host.docker.internal:5000"

//man

var tmp_user = {};

async function trainModel(data) {
    try {
        const response = await axios.post(`${PyAPI}/train`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10 * 60 * 1000
        });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error sending POST:',
            (error.response && error.response.data) || error.message
        );        
        throw error;
    }
}

async function useModel(data) {
    try {
        const response = await axios.post(`${PyAPI}/verify`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10 * 60 * 1000
        });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error sending POST:',
            (error.response && error.response.data) || error.message
        );        
        throw error;
    }
}

function waitForAuthorization(timeoutMs = 10*60*1000, intervalMs = 500) {
    return new Promise((resolve) => {
        const start = Date.now();
        const interval = setInterval(() => {
            console.log("checkong auth: ", tmp_user.authorized)
            if (tmp_user.authorized !== undefined) {
                clearInterval(interval);
                resolve(tmp_user.authorized);
            } else if (Date.now() - start > timeoutMs) {
                clearInterval(interval);
                resolve(false);
            }
        }, intervalMs);
    });
}


module.exports = {

    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    getMyLogs: function (req, res, next) {
        try {
            console.log('GET /users/mylogs called');
            console.log('Session userId:', req.session.userId);

            if (!req.session.userId) {
            console.log('No userId in session - user not logged in');
            return res.status(401).json({ message: "Not logged in" });
            }

            UserModel.findById(req.session.userId)
            .select('logs owner')
            .exec(function (err, user) {
                if (err) {
                console.error('Error fetching logs:', err);
                return res.status(500).json({ message: "Error fetching logs", error: err.message || err });
                }

                if (!user) {
                console.log('User not found for ID:', req.session.userId);
                return res.status(404).json({ message: "User not found" });
                }

                console.log('User owner flag:', user.owner);
                console.log('User logs:', user.logs);

                if (!user.owner) {
                console.log('Access denied: user is not owner');
                return res.status(403).json({ message: "Access denied: not an owner" });
                }

                return res.json(user.logs);
            });
        } catch (ex) {
            console.error('Unexpected error in getMyLogs:', ex);
            return res.status(500).json({ message: "Unexpected error", error: ex.message || ex.toString() });
        }
    },



    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    create: async function (req, res) {
        try {
            var user;
            if (req.body.fcmToken){
                user = new UserModel({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    _2FA: req.body._2FA,
                    fcmToken: req.body.fcmToken
                });
            }
            else{
                user = new UserModel({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    _2FA: req.body._2FA
                });
            }
    
            await user.save();
    
            if (req.body._2FA === true) {
                const data = {
                    "user_id": user._id.toString(),
                    "images": req.body.images
                };
             
                await trainModel(data);
            }
    
            return res.status(201).json(user);
    
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        }
    },

    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },


    login: async function(req, res, next) {
        try {
            const usr = await UserModel.findOne({ username: req.body.username });
    
            if (!usr) {
                return res.status(401).json({ message: "user not found" });
            }
    
            if (usr._2FA === true) {
                let user;
                try {
                    user = await UserModel.authenticateAsync(req.body.username, req.body.password);
                } catch (authError) {
                    console.error("Auth failed:", authError.message);
                    return res.status(401).json({ message: authError.message });
                }
                req.session.userId = user._id;

                console.log("usingPhoneApp:", req.body.usingPhoneApp)

                if (req.body.usingPhoneApp !== true && usr.fcmToken) {
                    const message = {
                        notification: {
                            title: "Face Verification",
                            body: "Please verify your face to complete login."
                        },
                        token: usr.fcmToken
                    };

                    try {
                        await admin.messaging().send(message);
                        console.log("Push notification sent to:", usr.username);
                    } catch (fcmErr) {
                        console.error("Failed to send FCM push:", fcmErr);
                    }

                    tmp_user = user;
                    tmp_user.authorized = undefined;

                    console.log("waiting for auth")

                    await waitForAuthorization();

                    console.log("auth: ", tmp_user.authorized)

                    // const errData = {
                    //     _id : "00000000000",
                    //     username : "waiting_for_images",
                    //     password : "000000",
                    //     email : "000000"
                    // }

                    const errData = {
                        _id : "",
                        username : "",
                        password : "",
                        email : ""
                    }

                    if (tmp_user.authorized === true){
                        return res.json(user);
                    }
                    
                    return res.json(errData);
                }

                const data = {
                    user_id: user._id.toString(),
                    image: req.body.images[0]
                };
    
                const verify = await useModel(data);
                if (verify.verified === true){
                    return res.json(user);
                }
                else {
                    const errData = {
                        _id : "",
                        username : "",
                        password : "",
                        email : ""
                    }
                    return res.json(errData);
                }
            } else {
                UserModel.authenticate(req.body.username, req.body.password, function (err, user) {
                    if (err || !user) {
                        const error = new Error('Wrong username or password');
                        error.status = 401;
                        return next(error);
                    }
                    req.session.userId = user._id;
                    return res.json(user);
                });
            }
        } catch (err) {
            return next(err);
        }
    },

    login_2fa: async function(req, res, next){
        const data = {
            user_id: tmp_user._id.toString(),
            image: req.body.images[0]
        };

        const verify = await useModel(data);
        if (verify.verified === true){
            tmp_user.authorized = true;
            return res.json(tmp_user);
        }
        else {
            tmp_user.authorized = false;
            const errData = {
                _id : "",
                username : "",
                password : "",
                email : ""
            }
            return res.json(errData);
        }
    },

    // login_2fa0: async function(req, res, next){
    //     var tmp_user0 = tmp_user;
    //     while (tmp_user0.authorized === false){
    //         tmp_user0 = tmp_user;
    //     }

    //     if (tmp_user.authorized === true){
    //         return res.json(tmp_user);
    //     }
    //     else {
    //         const errData = {
    //             _id : "",
    //             username : "",
    //             password : "",
    //             email : ""
    //         }
    //         return res.json(errData);
    //     }
    // },
    
    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    return res.json(user);
                }
            }
        });  
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    return res.status(201).json({});
                }
            });
        }
    },

    c_2FA: function (req, res, next) {
        if (req.session && req.session.userId) {
            UserModel.findById(req.session.userId, function (error, user) {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    const err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                }
    
                user._2FA = !user._2FA;
    
                user.save(function (saveError) {
                    if (saveError) {
                        return next(saveError);
                    }
                    return res.json({ _2FA: user._2FA });
                });
            });
        } else {
            const err = new Error('No active session');
            err.status = 401;
            return next(err);
        }
    }
    
};
