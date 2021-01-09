const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app').app;

// Acepta un chaiPluggin
chai.use(chaiHttp);

// Test de integracion.
describe('E2E App Integration Test', () => {
    it('should return Hello, World!!!', done => {
        // Haz esta llamada HTTP a este servidor.
        chai.request(app)
            .get('/')
            .end((err, res) => {
                chai.assert.equal(res.body.message, 'Hello, World!!!');
                done();
            });
    });
});


