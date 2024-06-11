
const jwt = require('jsonwebtoken')
// Middleware to check token-based authentication
function verifyToken(req, res, next) {
    const token = req.headers['authorization']
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token', error: "Unauthorized"});
            }
            req.user = decoded;
            console.log({user: decoded})
            next();
        });
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
}

module.exports = verifyToken