const express = require("express");
const logjs = require("log4js");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const config = require("./config/config");
const UserRoute = require("./routes/User");
const CategoryRoute = require("./routes/Categories");
const PostRoute = require("./routes/Post");
const NotificationRoute = require("./routes/Notifications");
const fileUpload = require("express-fileupload");
const { connectDb } = require("./utility/utility");
connectDb(config.mongourl);
require("./auth/passport")(passport);
const app = express();
const port  = process.env.PORT || config.port;
app.use("/static", express.static("public"));
app.use(fileUpload());

app.use(
    session({
        secret: "jai",
        resave: false,
        saveUninitialized: false
    })
);
logjs.configure({
    appenders: { logConf: { type: "file", filename: "logs/logs.log" } },
    categories: { default: { appenders: ["logConf"], level: "info" } }
});
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,HEAD");
    next();
});
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/notifications", NotificationRoute);
app.use("/categories", CategoryRoute);

app.get("/", (req, res) => {
    res.json({ message: req.user });
});
app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});