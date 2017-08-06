const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    username: 'user1@example.com',
    password: 'userOnePass',
    tokens: jwt.sign({
        _id: userOneId,
        access: 'login_access',
    }, process.env.JWT_SECRET).toString(),
    mobile: '0987654321',
    name: 'User One',
    surname: 'User One Surname',
    isActive: true,
    role: "1"
}, {
    _id: userTwoId,
    username: 'user2@example.com',
    password: 'userTwoPass',
    tokens: jwt.sign({
        _id: userTwoId,
        access: 'login_access',
    }, process.env.JWT_SECRET).toString(),
    mobile: '0123456789',
    name: 'User Two',
    surname: 'User Two Surname',
    isActive: true,
    role: "1"    
}];

const populateUsers = (done) => {
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        //both userOne and userTwo are promises
        //We can do something really cool
        //We use Promise.all which takes an array of promises and then when all of them are resolved, THEN
        //it would move forward
        //Promise.all([userOne, userTwo]).then( () => {});
        //above means till both userOne and userTwo are not saved in the DB, we won't have then

        return Promise.all([userOne, userTwo]);
    }).then( () => done());
}

module.exports = {
    users, populateUsers
}