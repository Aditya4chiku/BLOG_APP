const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        await jwt.verify(token, "XCBGH", (err, decode) => {
            if (err) {
                res.status(401).json({ msg: 'Token Not valid' })
            }
            else {
                req.user = decode.user;
                next();
            }
        })
    } catch (error) {

        res.status(500).json({ msg: 'Server Errouur' });
    }

}