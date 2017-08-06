require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var { mongoose } = require('./db/mongoose.js');
const { ObjectID } = require('mongodb');
const { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.text());

app.post('/register', (req, res) => {
    let body = _.pick(req.body, ['username', 'password', 'name', 'surname', 'mobile', 'accountNo']);
    let user = new User(body);
    user.isActive = true;
    user.role = "1";
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.send(user);
    }).catch((e) => res.status(400).send(e));
});

app.post('/api/login', (req, res) => {
    let {secret_key, username, password } = _.pick(req.body, ['secret_key', 'username', 'password']);
    User.findByCredentials(username, password).then( (user) => {
        return user.generateToken().then( (token) => {
            res.send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/api/token', (req, res) => {
    var token = req.header('Authorization').replace('Bearer ','');
    console.log(token);
    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        
        res.send(user);
    }).catch( (e) => {
        //401 means authentication invalid
        res.status(401).send();
    });
});


app.listen(port, () => console.log(`Server started and listening to Port ${port}`));

module.exports = { app };