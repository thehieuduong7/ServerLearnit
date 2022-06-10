const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const configMongoose = require("./configs/mongoDBConfig");
configMongoose.connect();
const router = require("./routers");
const PORT = process.env.PORT || 5000;

const app = express();
//config message when rest api
app.use(morgan("combined"));
//config body json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// config cors
app.use(cors());
//config router
router(app);

app.listen(PORT, () => console.log(`server start on port ${PORT}`));
