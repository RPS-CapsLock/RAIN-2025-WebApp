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
                await saveBase64Images(req.body.images, `./reg_${user._id}`);
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
            console.log("log1")
            console.log(usr)
    
            if (!usr || usr._2FA !== req.body._2FA) {
                return res.status(401).json({ message: "2FA mismatch or user not found" });
            }

            console.log("log2")
    
            if (usr._2FA === true) {
                console.log("log3")
                console.log("log3.000000001")
                let user;
                try {
                    console.log("Before auth");
                    user = await UserModel.authenticateAsync(req.body.username, req.body.password);
                    console.log("After auth");
                } catch (authError) {
                    console.error("Auth failed:", authError.message);
                    return res.status(401).json({ message: authError.message });
                }
                console.log("log3.001")
                console.log("user._id")
                req.session.userId = user._id;
                console.log("log3.01")
    
                await saveBase64Images(req.body.images, `./log_${user._id}`);
                console.log("log3.1")
    
                const data = {
                    user_id: user._id.toString(),
                    image: req.body.images[0]
                };

                console.log("VP")

                console.log("Verify payload:", {
                    user_id: user._id.toString(),
                    image: req.body.images[0].substring(0, 30) + "..."
                });
    
                await useModel(data);
                console.log("log3.2")
                return res.json(user);
            } else {
                console.log("log4")
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
