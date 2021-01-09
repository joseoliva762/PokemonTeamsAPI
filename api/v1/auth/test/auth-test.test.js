const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../app').app;
const usersController = require('../users.controller');
const teamsController = require('../../teams/teams.controller');
chai.use(chaiHttp);


beforeEach(async () => {
    await usersController.registerUser('bettatech', '1234');
    await usersController.registerUser('joseoliva', '9058');
});
afterEach(async () => { // Con promesas no necesitamos el done
    await teamsController.cleanUpTeams();
    await usersController.cleanUpUsers();
})
describe('Auth Test Suite', () => {
    it ('Should return 401 when no jwt token available.', done => {
        // Non Authorized, llave incorrecta, usuario sin autorizacion.
        chai.request(app)
            .get('/api/v1/teams')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            });
    });
    it('should return 400 when no data is provided', done => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('Should return 200 and token for succefull login', done => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({ user: 'bettatech', password: '1234'})
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });
    it ('Should return 200 when jwt token is valid.', done => {
        // Loggear un usuario.
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'bettatech', password: '1234'})
            .end((err, res) => {
                // Test jwt
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .get('/api/v1/teams')
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        done();
                    });
            });
    });
    it ('Should return 201 when the user successfully registers', done => {
        // Loggear un usuario.
        let user = {user: 'livcode', password: '1234'}
        chai.request(app)
            .post('/api/v1/auth/signup')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 201);
                chai.request(app)
                    .post('/api/v1/auth/login')
                    .set('content-type', 'application/json')
                    .send(user)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200)
                        done();
                    });
            });
    });
    it ('Should return 409 when the user already exists', done => {
        // Loggear un usuario.
        let user = {user: 'bettatech', password: '1234'}
        chai.request(app)
            .post('/api/v1/auth/signup')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 409);
                done();
            });
    });
});
after(done => {
    usersController.cleanUpUsers();
    done();
});

// it ('should return 403', done => {
//     // Forbiden, Usuario con autorización, pero sin permisos.
//     done();
// });