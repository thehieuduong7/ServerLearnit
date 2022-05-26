const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const KEY_PASSWORD = process.env.KEY_PASSWORD || "";

// @route Post api/auth/register
// @desc Register user
// @access public
router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ sucess: false, message: "missing username or password" });
	}
	try {
		// check exist
		const checkUser = await User.findOne({ username });
		if (checkUser)
			return res
				.status(400)
				.json({ sucess: false, message: "username is exist" });
		const hashPassword = crypto.AES.encrypt(password, KEY_PASSWORD).toString();
		const user = new User({ username, password: hashPassword });
		await user.save();
		return res.status(200).json({ sucess: true, message: "register success" });
	} catch (err) {
		return res.status(400).json({ sucess: false, message: err });
	}
});

// @route POST api/auth/login
// @desc login user
// @access public

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ sucess: false, message: "missing username or password" });
	}
	try {
		const user = await User.findOne({ username });
		// user not found
		if (!user) {
			return res
				.status(400)
				.json({ sucess: false, message: "incorrect username or password" });
		}
		//get bytes
		const bytes = crypto.AES.decrypt(user.password, KEY_PASSWORD);
		// convert bytes to string
		const decryptPassword = bytes.toString(crypto.enc.Utf8);

		if (decryptPassword !== password) {
			return res
				.status(400)
				.json({ sucess: false, message: "incorrect username or password" });
		}
		const accessToken = jwt.sign(
			{
				userId: user._id,
				username: user.username,
			},
			process.env.KEY_TOKEN
			//{ expiresIn: 300 }
		);
		return res
			.status(200)
			.json({ sucess: true, message: "login success", accessToken });
	} catch (err) {
		return res.status(400).json({ sucess: false, message: err });
	}
});

module.exports = router;
