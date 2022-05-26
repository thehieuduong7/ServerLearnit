const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (req, res, next) => {
	//auth: bearer token
	const authorization = req.header("Authorization");
	const token = authorization && authorization.split(" ")[1];
	if (!token)
		return res.status(401).json({
			success: false,
			message: "token not found",
		});
	try {
		const payloads = jwt.verify(token, process.env.KEY_TOKEN); //err jump to catch
		req.user = payloads;
		next();
	} catch (err) {
		res.status(401).json({ success: false, message: "invalid token" });
	}
};

module.exports = verifyToken;
