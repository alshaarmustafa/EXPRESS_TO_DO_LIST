const jwt = require('jsonwebtoken');

module.exports = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });
    return token;
}