const request = require('supertest');
const { app } = require('../server');
const expect = require('expect');
const { ObjectID } = require('mongodb');
const { User } = require('../models/user');


beforeEach((done) => {
    User.remove({}).then(() => done());
});

describe('POST /register', () => {
    it('should be able to register the user', (done) => {
        let name = 'User Number 1';
        let surname = 'Surname';
        let username= 'test@test.com';
        let password = '123456';
        let mobile = '1234567890';
        let accountNo = '1122334455';
        request(app)
            .post('/register')
            .send({ name, surname, username, password, mobile, accountNo })
            .expect(200)
            .expect((res) => {
                expect(res.body.user._id).toExist();
                expect(res.body.user.name).toBe(name);
                expect(res.body.user.username).toBe(username);
                expect(res.body.token).toExist();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.find({
                    username
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            })
    });
    //Should not create a user when it already exists

    //should not create user if information is not correct
});