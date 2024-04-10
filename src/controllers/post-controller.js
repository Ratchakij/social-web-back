import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE POST */
export const createPost = async (req, res, next) => {
  try {
    const value = req.body;
    console.log("value");
    const user = await User.findById(value.userId);

    const newPost = new Post({
      userId: value.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: value.description,
      userPicturePath: user.picturePath,
      picturePath: value.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

/* READ */
export const getFeedPosts = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

/* UPDATE */
export const likePost = async (req, res, next) => {
  try {
    console.log(req.params);
    console.log(req.body);
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLike = post.likes.get(userId);

    // (await isLike) ? post.likes.delete(userId) : post.likes.set(userId, true);

    if (isLike) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(201).json(updatePost);
  } catch (err) {
    next(err);
  }
};
