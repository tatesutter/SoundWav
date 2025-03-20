const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign({
        username: user.username,
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return accessToken;
    };

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) 
        return res.status(400).json({ error: "User not authenticated" });

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch(err) {
        return res.status(400).json({ error: err });
    }

    };

module.exports = { createTokens, validateToken };