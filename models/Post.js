const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchemal = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
	},
	url: {
		type: String,
	},
	status: {
		type: String,
		enum: ["TO LEARN", "LEARNING", "LEARNED"],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
});

module.exports = mongoose.model("posts", PostSchemal);
