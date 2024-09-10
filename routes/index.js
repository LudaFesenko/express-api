const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  UserController,
  PostController,
  CommentsController,
  FollowController,
  LikeController,
} = require("../controllers");

const authenticateToken = require("../middleware/auth");

const uploadDestination = "uploads";

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

// роуты пользователя
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put(
  "/users/:id",
  authenticateToken,
  uploads.single("avatar"),
  UserController.updateUser
);

// роуты постов
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);
module.exports = router;

// роуты комментариев
router.post("/comments", authenticateToken, CommentsController.createComments);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentsController.deleteComment
);

// роуты лайков
router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes/:id", authenticateToken, LikeController.unLikePost);

// роуты подписок
router.post("/follow", authenticateToken, FollowController.followUser);
router.delete(
  "/unfollow/:id",
  authenticateToken,
  FollowController.unFollowUser
);
