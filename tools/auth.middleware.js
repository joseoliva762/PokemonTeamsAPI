const JwtStrategy = require('passport-jwt').Strategy,
        ExtraJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const init = () => {
    const options = {
        jwtFromRequest: ExtraJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: process.env.SECRET_OR_KEY // TODO deberia estar en una vaiable de entorno.
    };
    passport.use(new JwtStrategy(options, (decoded, done) => {
        // console.log('decoded:', decoded);
        return done(null, decoded);
    }));
}

const protectWithJWT = (req, res, next) => {
    if (req.path == '/' || req.path == '/api/v1/auth/login' || req.path == '/api/v1/auth/signup') {
        return next();
    }
    return passport.authenticate('jwt', { session: false })(req, res, next);
}

exports.init = init;
exports.protectWithJWT = protectWithJWT;