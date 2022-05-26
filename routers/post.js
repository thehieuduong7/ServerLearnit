const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");
// @route POST api/posts
// @desc create post
// access private, need login

router.post("/", verifyToken, async (req, res) => {
	const { title, description, url, status } = req.body;

	//check data
	if (!title)
		return res.status(400).json({
			success: false,
			message: "title is required",
		});
	try {
		const post = new Post({
			title,
			description,
			url: url.startsWith("https://") ? url : `https://${url}`,
			status: status || "TO LEARN",
			user: req.user.userId,
		});
		await post.save();
		return res.json({
			success: true,
			message: "congrats",
			post,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ succes: false, message: err });
	}
});

// @route GET api/posts
// @desc get post
// @access private, need login
router.get("/", verifyToken, async (req, res) => {
	try {
		const posts = await Post.findOne({ user: req.user.userId }).populate(
			"user",
			["username"]
		);
		res.json({ succes: true, message: "congrats", posts });
	} catch (err) {
		res.status(403).json({ succes: false, message: err });
	}
});

// @route PUT api/posts
// @desc update post
// @access private, need login

router.put("/:id", verifyToken, async (req, res) => {
	const { title, description, url, status } = req.body;
	const payloads = {
		title,
		description,
		url: !url ? undefined : url.startsWith("https://") ? url : `https://${url}`,
		status: status,
	};
	const filter = { _id: req.params.id, user: req.user.userId };
	try {
		const post = await Post.findOneAndUpdate(
			filter,
			{ title, description, url, status },
			{ new: true }
		);
		await post.populate("user");
		res.json({ success: true, message: "update success", post });
	} catch (err) {
		console.log(err);
		res.status(401).json({ succes: false, message: err });
	}
});
// @route Delete api/posts
// @desc Delete post
// @access private, need login
router.delete("/:id", verifyToken, async (req, res) => {
	const { title, description, url, status } = req.body;
	const filter = { _id: req.params.id, user: req.user.userId };
	try {
		const post = await Post.findOneAndDelete(filter);
		await post.populate("user");

		res.json({ success: true, message: "remove success", post });
	} catch (err) {
		console.log(err);
		res.status(401).json({ succes: false, message: err });
	}
});
module.exports = router;
