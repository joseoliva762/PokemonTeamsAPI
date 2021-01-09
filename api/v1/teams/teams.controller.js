const mongoose = require('mongoose');
const { to } = require('../../../tools/to');

const TeamsModel = mongoose.model(
    'TeamsModel',
    {
        userId: String,
        teamLength: Number,
        team: []
    }
)

const cleanUpTeams = () => {
    return new Promise(async (resolve, reject) => {
        await TeamsModel.deleteMany({}).exec();
        resolve()
    });
}
const bootstrapTeam = (userId) => {
    return new Promise(async (resolve, reject) => {
        let team = [];
        let newTeam = new TeamsModel({
            userId: userId,
            teamLength: team.length,
            team: team
        });
        await newTeam.save();
        resolve();
    })
}

const getTeamOfUser = userId => {
    return new Promise(async (resolve, reject) => {
        let [err, teamDb] = await to(TeamsModel.findOne({ userId: userId }).exec());
        if(err || !teamDb) return reject(err);
        resolve(teamDb || []);
    });
}

const addPokemon  = (userId, pokemon) => {
    return new Promise(async (resolve, reject) => {
        let [err, teamDb] = await to(getTeamOfUser(userId));
        if(err || !teamDb) return reject(err);

        if (teamDb.team.length == 6) return reject('You have already 6 pokemons on your teams');
        teamDb.team.push(pokemon);
        teamDb.teamLength = teamDb.team.length;
        await teamDb.save();
        resolve();
    });
}

const setTeam = (userId, team) => {
    return new Promise(async (resolve, reject) => {
        let [err, teamDb] = await to(getTeamOfUser(userId));
        if (err) return reject(err);
        teamDb.team = team;
        teamDb.teamLength = team.length;
        await teamDb.save();
        resolve();
    });
}

const deletePokemonAt = (userId, pokeId) => {
    return new Promise(async (resolve, reject) => {
        let [err, teamDb] = await to(getTeamOfUser(userId));
        if(err || !teamDb) return reject(err);

        if (teamDb.team[pokeId]) {
            teamDb.team.splice(pokeId, 1);
        }
        await teamDb.save();
        resolve();
        // reject('Pokemon Index out of range');
    });
}

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeams = cleanUpTeams;
exports.deletePokemonAt = deletePokemonAt;
