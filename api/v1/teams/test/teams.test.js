const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../app').app;
const usersController = require('../../auth/users.controller');
const teamsController = require('../teams.controller');
chai.use(chaiHttp);


beforeEach(async () => {
    await usersController.registerUser('bettatech', '1234');
    await usersController.registerUser('joseoliva', '9058');
});
afterEach(async () => { // Con promesas no necesitamos el done
    await teamsController.cleanUpTeams();
    await usersController.cleanUpUsers();
})
describe('Teams Test Suite', () => { 
    it ('Should return the given users team', done => {
        // Loggear un usuario.
        let team = [{name: 'Charizard'}, {name: 'Blaztoise'}];
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'joseoliva', password: '9058'})
            .end((err, res) => {
                // Expect valid login
                chai.assert.equal(res.statusCode, 200);
                let token = res.body.token;
                chai.request(app)
                    .put('/api/v1/teams')
                    .send({ team: team })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .get('/api/v1/teams')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                //Teien equipo con Charizard y Blastoise
                                // {trainer: 'joseoliva', team: [pokemons]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'joseoliva');
                                chai.assert.equal(res.body.team.length, team.length);
                                chai.assert.equal(res.body.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team[1].name, team[1].name);
                                done();
                            });
                    });
            });
    });
    it ('Should return the pokedex number', done => {
        // Loggear un usuario.
        let pokemonName = 'Bulbasaur';
        let pokedexNumber = 1;
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'joseoliva', password: '9058'})
            .end((err, res) => {
                // Expect valid login
                chai.assert.equal(res.statusCode, 200);
                let token = res.body.token;
                chai.request(app)
                    .post('/api/v1/teams/pokemons')
                    .send({ name: pokemonName })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .get('/api/v1/teams')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                //Teien equipo con Charizard y Blastoise
                                // {trainer: 'joseoliva', team: [pokemons]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'joseoliva');
                                chai.assert.equal(res.body.team.length, 1);
                                chai.assert.equal(res.body.team[0].name, pokemonName);
                                chai.assert.equal(res.body.team[0].pokedexNumber, pokedexNumber);
                                done();
                            });
                    });
            });
    });
    it ('Should delete the pokemon of the teams', done => {
        // Loggear un usuario.
        let team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Pikachi'}];
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'joseoliva', password: '9058'})
            .end((err, res) => {
                // Expect valid login
                chai.assert.equal(res.statusCode, 200);
                let token = res.body.token;
                chai.request(app)
                    .put('/api/v1/teams')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .delete('/api/v1/teams/pokemons/1')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.request(app)
                                    .get('/api/v1/teams')
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {
                                        chai.assert.equal(res.statusCode, 200);
                                        chai.assert.equal(res.body.trainer, 'joseoliva');
                                        chai.assert.equal(res.body.team.length, team.length - 1);
                                        done();
                                    });
                            });
                    });
            });
    });
    it ('Should return 400 when already have 6 pokemons on a team', done => {
        // Loggear un usuario.
        let team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Pikachi'}, {name: 'dito'}, {name: 'Blastoise'}, {name: 'Pikachi'}];
        let newPokemon = {name: 'eevee'};
        chai.request(app)
            .post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'joseoliva', password: '9058'})
            .end((err, res) => {
                // Expect valid login
                chai.assert.equal(res.statusCode, 200);
                let token = res.body.token;
                chai.request(app)
                    .put('/api/v1/teams')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                            chai.assert.equal(res.statusCode, 200);
                            chai.request(app)
                                .post('/api/v1/teams/pokemons')
                                .send(newPokemon)
                                .set('Authorization', `JWT ${token}`)
                                .end((err, res) => {
                                    chai.assert.equal(res.statusCode, 400);
                                    done();
                                });
                    });
            });
    }).timeout(3000);
});
after(done => {
    usersController.cleanUpUsers();
    done();
});