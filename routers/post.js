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
			message: "Add post success!!!",
			post,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false, message: JSON.stringify(err) });
	}
});

// @route GET api/posts
// @desc get post
// @access private, need login
router.get("/", verifyToken, async (req, res) => {
	try {
		const posts = await Post.find({ user: req.user.userId }).populate("user", [
			"username",
		]);
		res.json({ success: true, message: "Get posts success", posts });
	} catch (err) {
		res.status(403).json({ success: false, message: JSON.stringify(err) });
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
		res.json({ success: true, message: "Update post success!!!", post });
	} catch (err) {
		console.log(err);
		res.status(401).json({ success: false, message: JSON.stringify(err) });
	}
});
// @route Delete api/posts
// @desc Delete post
// @access private, need login
router.delete("/:id", verifyToken, async (req, res) => {
	const filter = { _id: req.params.id, user: req.user.userId };
	try {
		const post = await Post.findOneAndDelete(filter);

		res.json({ success: true, message: "Delete post success!!!", post });
	} catch (err) {
		console.log(err);
		res.status(401).json({ success: false, message: JSON.stringify(err) });
	}
});

// // @route get api/posts/:id
// // @desc get post
// // @access private, need login
// router.get("/:id", verifyToken, async (req, res) => {
// 	const filter = { _id: req.params.id, user: req.user.userId };
// 	try {
// 		const post = await Post.findOne(filter);
// 		await post.populate("user").select("-password");
// 		if (!post) {
// 			throw Error(`Post id ${req.params.id} not found`);
// 		}
// 		res.json({ success: true, message: "Get post success!!!", post });
// 	} catch (err) {
// 		res.status(404).json({ success: false, message: JSON.stringify(err) });
// 	}
// });
module.exports = router;
