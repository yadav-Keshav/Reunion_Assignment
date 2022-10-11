const createError = require("../error");
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const { json } = require("express");
function authenticateUser(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(createError(401, "Please Login first !"))
    }
    jwt.verify(authorization, process.env.SECRET, (err, payload) => {
        if (err) {
            return next(createError("403", "Token is not valid!"))
        }
        const { id } = payload;
        User.findById(id).then(result => {
            req.user = result;
            next()
        })
    })
}

module.exports = authenticateUser;