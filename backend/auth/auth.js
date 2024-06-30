const user = require('../models/user.model');
const jwt = require('jsonwebtoken');
const privateKey = require('./private_key');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization') ;
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const verified = jwt.verify(token, privateKey);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
}
