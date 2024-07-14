const Strategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    passport = require("passport");
const { ErrorSchema } = require("../utils/responseHandler")

const authMiddleware = () => {
    console.log("authMiddleware")
    const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
    const secret = "SecretKey";
    const jwtStrategy = Strategy;
    const header = {
        jwtFromRequest: extractJwt,
        secretOrKey: secret,
    };


    const jwtAuth = new jwtStrategy(header, (payload, done) => {
        console.log("payload", payload)
        done(null, payload);
    });

    // ErrorSchema("Unauthorized",401)
    return jwtAuth;
};

const authenticateUserJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: JSON.stringify(err) });
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("err", err)
        console.log("user", user)
        console.log("info", info)
        return next();
    })(req, res, next);
};

const authenticateAdminJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: JSON.stringify(err) });
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(user.role == "user"){
            return res.status(403).json({ message: "Forbidden" });
        }
        return next();
    })(req, res, next);
};

module.exports = {
    authMiddleware,
    authenticateUserJWT,
    authenticateAdminJWT
}