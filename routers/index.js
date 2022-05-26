const authRouter = require("./auth");
const postRouter = require("./post");
module.exports = function (app) {
	app.use("/api/auth", authRouter);
	app.use("/api/posts", postRouter);
};
