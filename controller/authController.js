const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const createError = require('../error');
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createError(401, "Email and Password should not be empty"));
    }
    User.findOne({ email }, (err, user) => {
        if (!user) {
            return next(createError(401, "User not found."));
        }
        else {
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    return next(createError(401, "Wrong Credential"));
                }
                const token = jwt.sign({ id: user._id }, process.env.SECRET);
                return res.status(201).send({ token })
            })
        }

    })
}



exports.register = async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return next(createError(401, "Please fill all required fields"));

    }
    User.findOne({ email }, (err, user) => {
        if (user) {
            return next(createError(401, 'User already register'));
        }
        else {
            User.create({ name, email, password, token }, (err, user) => {
                if (user) {
                    return res.status(200).json({ message: "Sucessfully Created" });
                }
                else {
                    return next(createError(401, err.message));
                }
            })
        }
    })
}