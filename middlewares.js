const authMiddleware = require('./tools/auth.middleware');
const bodyParser = require('body-parser');
// const helmet = require('helmet');

exports.setupMiddlewares = app => {
    app.use(bodyParser.json()); // Leer JSON del body
    // app.use(helmet());
    authMiddleware.init();
    app.use(authMiddleware.protectWithJWT);
}

