const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name should not be Empty"]
    },
    email: {
        type: String,
        required: [true, "Email should not be Empty"],
        validate: [isEmail, "Invalid Email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password should not be Empty"],
        minlength: [8, 'Password must be Greater than 8 letters']
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }]
})

//Hash password before save
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

//Method for comapre password
userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, res) => {
        if (err) {
            return cb(err);
        }
        cb(null, res);
    })
};


module.exports = new mongoose.model('User', userSchema);
