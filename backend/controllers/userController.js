var UserModel = require('../models/userModel.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function trainModel(data) {
    try {
        const response = await axios.post('http://localhost:5000/train', data, {
            headers: {
                'Content-Type': 'application/json'
            }
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
        const response = await axios.post('http://localhost:5000/verify', data, {
            headers: {
                'Content-Type': 'application/json'
            }
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
            const user = new UserModel({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                _2FA: req.body._2FA
            });
    
            await user.save();
    
            if (req.body._2FA === true) {
                const data = {
                    "user_id": user._id.toString(),
                    "images": req.body.images
                };
                console.log({
                    user_id: data.user_id,
                    image_count: Array.isArray(data.images) ? data.images.length : 0,
                    image_preview: Array.isArray(data.images) ? data.images.map((_, i) => `[Image ${i + 1}]`) : []
                });                
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
    
            if (!usr || usr._2FA !== req.body._2FA) {
                return res.status(401).json({ message: "2FA mismatch or user not found" });
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
    
                const data = {
                    user_id: user._id.toString(),
                    image: req.body.images[0]
                };
    
                await useModel(data);
                return res.json(user);
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
    }
};
