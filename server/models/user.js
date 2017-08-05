const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    surname:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        trim: true
    },
    mobile:{
        type: String,
        trim: true
    },
    accountNo:{
        type: String,
        trim: true
    },
    isActive:{
        type: Boolean,
        required: true
    },
    profilePicture: {
        type: String
    },
    lastLogin: {
        type: String
    },
    role:{
        type: String,
        required: true
    }
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'name', 'surname', 'username', 'mobile', 'mobile', 
        'token', 'profilePicture', 'lastLogin', 'role']);
}

UserSchema.methods.generateToken = function(){
    var user = this;
    var access = 'login_access';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET).toString();

    user.token = token;
    user.lastLogin = new Date().getTime().toString();
    return user.save().then((user) => {
        return token;
    });
}

UserSchema.statics.findByCredentials = function (username, password) {
    var User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });
        }
        );
    });
};


//Define your database event schema here: i.e. pre. before saving the details into the db
//next argument should be provided and to be called eventually
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (salt) {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (hash) {
                        user.password = hash;
                        next();
                    }
                })
            }
        });
    } else {
        next();
    }
});


var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}