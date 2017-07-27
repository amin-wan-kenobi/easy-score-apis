const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

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
    }
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'name', 'surname', 'username', 'mobile']);
}

UserSchema.methods.generateToken = function(){
    var user = this;
    var access = 'login_access';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET).toString();

    user.token = token;
    return user.save().then((user) => {
        return token;
    });
}


//Define your database event schema here: i.e. pre. before saving the details into the db

var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}