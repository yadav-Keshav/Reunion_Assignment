const express = require('express');
const { login, register } = require('../controller/authController');
const { createPost, deletePost, likePost, unLikePost, comment, getPostById, getAllPost } = require('../controller/postController');
const { follow, unfollow, profile } = require('../controller/userController');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();
router.post("/register", register);
router.post("/authenticate", login);

//user operatio routing 
router.post("/follow/:id", authenticateUser, follow);
router.post("/unfollow/:id", authenticateUser, unfollow);
router.get("/user", authenticateUser, profile);

//post operation routing
router.post("/posts", authenticateUser, createPost);
router.delete("/posts/:id", authenticateUser, deletePost);
router.post("/like/:id", authenticateUser, likePost);
router.post("/unlike/:id", authenticateUser, unLikePost);
router.post("/comment/:id", authenticateUser, comment);
router.get("/posts/:id", authenticateUser, getPostById);
router.get("/all_posts", authenticateUser, getAllPost);

module.exports = router;