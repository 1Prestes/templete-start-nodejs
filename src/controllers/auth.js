const jwt = require('jsonwebtoken');

const config = require('../config/config');

const auth = (req, res, next) => {
    const token_header = req.headers.auth;

    if (!token_header) return res.status(401).send({ error: 'Opa, parece ue você não tem autorização para isso :V' });

    jwt.verify(token_header, config.jwt_pass, (err, decoded) => {
        if (err) res.status(401).send({ error: 'Opa, tem algo estranho acontecendo ai o.o' });
        res.locals.auth_data = decoded;
        return next();
    })
}

module.exports = auth;