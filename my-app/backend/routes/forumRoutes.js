import express from "express";
import Forum from "../models/Forum.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   📜 GET ALL FORUM POSTS
   ========================================================= */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Forum.find()
      .populate("author", "name userId")
      .populate("comments.author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("FORUM FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error fetching forum" });
  }
});

/* =========================================================
   ➕ CREATE FORUM POST 
   ========================================================= */
router.post("/", auth, async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ msg: "Title and content required" });
  }

  try {
    const newPost = await Forum.create({
      title,
      content,
      category: category || "General",
      author: req.user.id
    });

    const populatedPost = await Forum.findById(newPost._id).populate("author", "name userId");
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("FORUM CREATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   ❤️ LIKE / UNLIKE POST
   ========================================================= */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Check if user already liked
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   💬 ADD COMMENT
   ========================================================= */
router.post("/:id/comment", auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: "Comment text required" });

  try {
    const post = await Forum.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({ text, author: req.user.id });
    await post.save();
    
    // Refresh with population
    const updatedPost = await Forum.findById(post._id)
      .populate("comments.author", "name");

    res.json(updatedPost.comments);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
