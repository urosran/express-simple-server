let express = require("express");
const cors = require("cors");
const chalk = require('chalk')
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
let multer = require("multer");

//<editor-fold desc="Server Set Up">
const app = express();
dotenv.config();

let allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:3001",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                let msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
);

app.use(function (req, res, next) {
    let origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
// don't forget to put process.env.port for heroku
app.listen(process.env.PORT || 5001, function () {
    console.log("App listening on", 5001);
});

const UPLOAD_FILES_DIR = "./uploads";
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_FILES_DIR);
    },
    filename(req, file = {}, cb) {
        console.log(file, "filename")
        const {originalname} = file;
        let questionUid = originalname.split('.')[0]
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
        // cb(null, `${questionUid}${'SEPARATOR'}${Date.now()}${fileExtension}`);
    }
});
const uploadElla = multer({storage: storage});

//</editor-fold>
