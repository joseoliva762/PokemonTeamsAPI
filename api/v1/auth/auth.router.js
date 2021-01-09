const express = require('express');
const router = express.Router();
const authHttpHandle = require('./auth.http');


// Definir ruta como entidad y luego las operaciones.
router.route('/login')
    .post(authHttpHandle.loginUser);

router.route('/signup')
    .post(authHttpHandle.signupUser);
    
exports.router = router;