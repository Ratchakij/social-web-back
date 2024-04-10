import express from "express";
import * as postController from "../controllers/post-controller.js";

const router = express.Router();

/* READ */
router.get("/", postController.getFeedPosts);
router.get("/:userId/posts", postController.getUserPosts);

/* UPDATE */
router.patch("/:id/like", postController.likePost);

export default router;
