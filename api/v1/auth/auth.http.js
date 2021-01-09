// Capa de gestion de HTTP.
const usersController = require('./users.controller');
const jwt = require('jsonwebtoken');
const { to } = require('../../../tools/to');

const loginUser = async (req, res) => {
    // Comprobacion de credenciales ? generamos un JWT : error;
    if (!req.body) return res.status(400).json({message: 'Missing Data'});
    else if (!req.body.user || !req.body.password) return res.status(400).json({message: 'Missing Data'});

    const username = req.body.user;
    const password = req.body.password;
    let [err, response] = await to(usersController.checkUserCredentials(username, password));
    if (err || !response) res.status(401).json({ message: 'Invalid Credentials' });

    // Generar el JWT
    let [userError, user] = await to(usersController.getUserIdFromUsername(username));
    if (userError) res.status(400).json({ message: userError });
    let userId = user.userId;
    
    const token = jwt.sign({userId: userId}, process.env.SECRET_OR_KEY);
    res.status(200).json(
        {token: token}
    );
}

const signupUser = async (req, res) => {
    if (!req.body) return res.status(400).json({message: 'Missing Data'});
    else if (!req.body.user || !req.body.password) return res.status(400).json({message: 'Missing Data'});


    const username = req.body.user;
    const password = req.body.password;
    const [err, response] = await to(usersController.registerUser(username, password));
    if (err) return res.status(409).json({ message: err });

    res.status(201).send();
}

exports.loginUser = loginUser;
exports.signupUser = signupUser;