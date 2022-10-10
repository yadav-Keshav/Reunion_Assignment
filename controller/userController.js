const createError = require('../error');
const User = require('../model/userModel');

exports.follow = (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(req.user._id, { $push: { followers: id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.unfollow = (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(req.user._id, { $pop: { followers: id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.profile = (req, res) => {
    User.findById(res.user._id, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        const { name, followers, following } = result;
        return res.status(200).json({ name, noOfFollowers: followers.size(), noOfFollowing: following.size() });
    })
}