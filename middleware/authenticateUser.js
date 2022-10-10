const createError = require("../error");
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const { json } = require("express");
function authenticateUser(req, res, next) {
    const { authorisation } = req.headers;
    if (!authorisation) {
        return next(createError(401, "Please Login first !"))
    }
    jwt.verify(authorisation, process.env.SECRET, (err, payload) => {
        if (err) {
            return next(createError("403", "Token is not valid!"))
        }
        const { id } = payload;
        User.findById(id).then(userdata => {
            req.user = userdata
            next()
        })
    })
}

module.exports=authenticateUser;