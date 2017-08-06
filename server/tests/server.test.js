const request = require('supertest');
const { app } = require('../server');
const expect = require('expect');
const { ObjectID } = require('mongodb');
const { User } = require('../models/user');
const { users, populateUsers } = require('./seed/user_seed');


beforeEach(populateUsers);

describe('POST /register', () => {
    it('should be able to register the user', (done) => {
        let testuser = {
            name : 'Maleki',
            surname : 'Malekian',
            username : 'easy_score@easyscore.com',
            password : '123456',
            mobile : '1234567890',
            accountNo : '112233-4455',
            isActive: true,
            role: "1"
        }

        request(app)
            .post('/register')
            .send(testuser)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toExist();
                expect(res.body.name).toBe(testuser.name);
                expect(res.body.username).toBe(testuser.username);
                expect(res.body.token).toExist();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.find({
                    username: testuser.username
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });
    
    it('should not create a user when it already exists', (done) => {
        request(app)
            .post('/register')
            .send(users[0])
            .expect(400)
            .end(done);
    });
    
    
    it('should not create user if information is not correct', (done) => {
        request(app)
            .post('/register')
            .send({
                username: 'something',
                password: '1234'
            })
            .expect(400)
            .end(done);
    });
});