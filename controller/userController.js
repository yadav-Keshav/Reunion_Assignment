const createError = require('../error');
const User = require('../model/userModel');

exports.follow = (req, res, next) => {
    const id = req.params.id;
    const following = req.user.following;
    if (following.includes(id)) {
        return next(createError(401, "Already following"))
    }
    User.findByIdAndUpdate(req.user._id, { $push: { following: id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
    })
    User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.unfollow = (req, res, next) => {
    const id = req.params.id;
    const following = req.user.following;
    if (!following.includes(id)) {
        return next(createError(401, "You are not following"))
    }
    User.findByIdAndUpdate(req.user._id, { $pop: { following: id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
    })
    User.findByIdAndUpdate(id, { $pop: { followers: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })

}

exports.profile = (req, res, next) => {
    User.findById(req.user._id, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        const { name, followers, following } = result;
        return res.status(200).json({ name, noOfFollowers: followers.length, noOfFollowing: following.length });
    })
}