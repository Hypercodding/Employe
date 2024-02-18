var jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_secret = 'Usman';

const fetchuser = (req, res, next)=> {
    const token = req.header('auth-header');
    if(!token){
        res.status(401).send({error: "Please use authenticate token"})
    }
    try {
        const data = jwt.verify(token, JWT_secret);
        req.user = data.user
        next();   
    } catch (error) {
        res.status(401).send({error: "Please use authenticate token"})
    }
}

module.exports = fetchuser