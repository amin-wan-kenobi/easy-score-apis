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
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.send({user, token});
    }).catch((e) => res.status(400).send(e));
});


app.listen(port, () => console.log(`Server started and listening to Port ${port}`));

module.exports = { app };