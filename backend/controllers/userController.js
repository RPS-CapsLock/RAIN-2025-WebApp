var UserModel = require('../models/userModel.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function saveBase64Images(images, outputDir) {
    try {
        // const images = JSON.parse(base64JsonArray);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        images.forEach((base64Data, index) => {
            const matches = base64Data.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
            let buffer, extension;

            if (matches) {
                extension = matches[1].split('/')[1];
                buffer = Buffer.from(matches[2], 'base64');
            } else {
                extension = 'png';
                buffer = Buffer.from(base64Data, 'base64');
            }

            const filename = path.join(outputDir, `image_${index + 1}.${extension}`);
            fs.writeFileSync(filename, buffer);
            console.log(`Saved: ${filename}`);
        });

        console.log('All images have been saved.');
    } catch (error) {
        console.error('Error saving images:', error);
    }
}

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
        console.error('Error sending POST:', error.response?.data || error.message);
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
        console.error('Error sending POST:', error.response?.data || error.message);
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
        var user;

        if (req.body._2FA == true){
            await saveBase64Images(req.body.images, './reg_images');
            user = new UserModel({
                username : req.body.username,
                password : req.body.password,
                email : req.body.email,
                _2FA : req.body._2FA
            });
        }
        else{
            user = new UserModel({
                username : req.body.username,
                password : req.body.password,
                email : req.body.email
            });

        }

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
        });
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


    login: async function(req, res, next){
        var usr = await UserModel.findOne({ username: req.body.username });

        if (usr._2FA === req.body._2FA) {
            if (usr._2FA === true) {
                await saveBase64Images(req.body.images, './log_images');
                UserModel.authenticate(req.body.username, req.body.password, function (err, user) {
                    if (err || !user) {
                        var err = new Error('Wrong username or paassword');
                        err.status = 401;
                        return next(err);
                    }
                    req.session.userId = user._id;
                    return res.json(user);
                });
            }
            else {
                UserModel.authenticate(req.body.username, req.body.password, function (err, user) {
                    if (err || !user) {
                        var err = new Error('Wrong username or paassword');
                        err.status = 401;
                        return next(err);
                    }
                    req.session.userId = user._id;
                    return res.json(user);
                });
            }
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
