const bcrypt = require('bcrypt');

const hashPassword = (plainTextPassword, done) => bcrypt.hash(plainTextPassword, 10, done);
const hashPasswordSync = plainTextPassword => bcrypt.hashSync(plainTextPassword, 10);
const comparePassword = (plainPassword, hashPassword, done) => bcrypt.compare(plainPassword, hashPassword, done);

exports.hashPassword = hashPassword;
exports.hashPasswordSync = hashPasswordSync;
exports.comparePassword = comparePassword;