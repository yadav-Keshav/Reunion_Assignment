const createError = require('../error');
const Post = require('../model/postModel');
exports.createPost = (req, res, next) => {
    const { text, desc } = req.body
    if (!text || !desc) {
        return res.status(422).json({ error: "Plase Enter all required fields" })
    }
    const post = new Post({
        text,
        desc,
        postedBy: req.user._id
    });
    post.save(post)
        .then(result => {
            res.status(200).json({ post: result })
        })
        .catch(err => {
            return next(createError(401, err.message));
        })
}

exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id, (err, result) => {
        if (!result) {
            return next(createError(401, "Post not found"));
        }
        if (result.postedBy.toString() === req.user._id.toString()) {
            result.remove()
                .then(() => {
                    return res.status(200).json({ message: 'Sucesfully deleted' })
                })
                .catch(err => {
                    return next(createError(401, err.message));
                })
        }
        else {
            return next(createError(401, "Cannot be deleted"));
        }
    })
}

exports.likePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        if (!result.likes.includes(req.user._id)) {
            result.likes.push(req.user._id);
        }
        result.save()
            .then(() => {
                return res.status(200).json({ message: "Sucessful" })
            })
            .catch(err => {
                return next(createError(401, err.message));
            })
    })
}

exports.unLikePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        if (result.likes.includes(req.user._id)) {
            result.likes.pop(req.user._id);
        }
        result.save()
            .then(() => {
                return res.status(200).json({ message: "Sucessful" })
            })
            .catch(err => {
                return next(createError(401, err.message));
            })
    })
}

exports.comment = (req, res, next) => {
    const id = req.params.id;
    const { text } = req.body;
    Post.findByIdAndUpdate(id, { $push: { comments: { text, postedBy: req.user._id } } }, { new: true }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        return res.status(200).json({ message: "Sucessful" })
    })
}

exports.getPostById = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id, (err, doc) => {
        if (!doc) {
            return next(createError(401, "Post not found"));
        }
        return res.status(200).json({ _id: doc._id, noOfLikes: doc.likes.length, comments: doc.comments })
    })
}

exports.getAllPost = (req, res, next) => {
    Post.find({ postedBy: req.user._id }, (err, result) => {
        if (err) {
            return next(createError(401, err.message));
        }
        const posts = result.map(data => {
            return {
                id: data._id, title: data.title, desc: data.desc,
                created_at: data.crecreatedAt, comments: data.comments, likes: data.likes.length
            }
        })
        posts.sort(function (a, b) { return b.created_at-a.created_at })
        return res.status(200).json({ posts });
    })
}
