const crypto = require('../../../tools/password.crypt');
const uuid = require('uuid');
const teams = require('../teams/teams.controller');
const { to } = require('../../../tools/to');
const mongoose = require('mongoose');
const { use } = require('chai');


const UserModel = mongoose.model(
    'UserModel',
    {
        userId: String,
        username: String,
        password: String
    }
)

const getUserIdFromUsername = username => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ username: username }).exec());
        if (err || !result) reject(`User Not Found: ${err}`);
        else resolve(result);
    });
}

// const getUser = userId => new Promise((resolve, reject) => resolve(usersDb[userId]));
const getUser = userId => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ userId: userId }).exec());
        if (err || !result) reject(`User Not Found: ${err}`);
        else resolve(result);
    });
}
const __userAlreadyExists = async username => {
    const [err, user] = await to(getUserIdFromUsername(username));
    return user;
}

const registerUser = (username,  password) => {
    return new Promise( async (resolve, reject) => {
        const [err, isUserOnDatabase] = await to(__userAlreadyExists(username));
        if (isUserOnDatabase) return reject('User Already Exist.'); 

        let userId = uuid.v4();
        let newUser = new UserModel({
            userId: userId,
            username: username,
            password: crypto.hashPasswordSync(password)
        });
        await newUser.save();
        await teams.bootstrapTeam(userId);
        resolve();
    });
}
// registerUser('livcode', '9058');

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    });
}

const checkUserCredentials = (username, password) => {
    // TODO: Comprorar si las credenciales son correctas.
    return new Promise(async (resolve, reject) => {
        let [err, user] = await to(getUserIdFromUsername(username));
        if (err) reject(err);
        if (user) {
            crypto.comparePassword(password, user.password, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }
    });
}

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUserIdFromUsername = getUserIdFromUsername;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;