const createError = require('../error');
const Post = require('../model/postModel');
exports.createPost = (req, res, next) => {
    const { title, desc } = req.body
    if (!title || !desc) {
        return res.status(422).json({ error: "Plase Enter all required fields" })
    }
    const post = new Post({
        title,
        desc,
        postedBy: { id: req.user._id }
    });
    post.save()
        .then(result => {
            res.status(200).json({ post: result })
        })
        .catch(err => {
            return next(createError(401, err.message));
        })
}

exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id, (err, doc) => {
        if (err) {
            return next(createError(401, err.message));
        }
        if (doc.postedBy.id.toString() === req.user._id.toString()) {
            doc.remove()
                .then(result => {
                    return res.status(200).json({ message: 'Sucesfully deleted' })
                })
                .catch(err => {
                    return next(createError(401, err.message));
                })
        }
        return next(createError(401, "Cannot be deleted"));
    })
}

exports.likePost = (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { $push: { likes: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.unLikePost = (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { $pop: { likes: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.comment = (req, res, next) => {
    const id = req.params.id;
    const { text } = req.body;
    User.findByIdAndUpdate(id, { $push: { comments: { text, postedBy: req.user._id } } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.getPostById = (req, res, next) => {
    const id = req.params.id;
    User.findById(id, (err, doc) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ _id: doc._id, noOfLikes: doc.likes.size(), comments: doc.comments })
    })
}

exports.getAllPost = (req, res, next) => {
    User.find({ postedBy: req.user._id }, (err, res) => {
        if (err) {
            return next(createError(401, err.message));
        }
        const data = res.map(x => {
            return {
                id: x._id, title: x.title, desc: x.desc,
                created_at: x.crecreatedAt, comments: x.comments, likes: x.likes.size()
            }
        })
        data.sort(function (a, b) { return a.created_at - b.created_at })
        return res.status(200).json({ data });
    })
}
