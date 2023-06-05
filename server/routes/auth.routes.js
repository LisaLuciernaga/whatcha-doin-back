const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

const saltRounds = 10;

//POST -> http://localhost:5005/auth/signup
router.post("/signup", (req, res, next) => {
  const { username, email, password, passwordRepeat } = req.body;

  if (username == "" || email == "" || password == "" || passwordRepeat == "") {
    next("Please fill in all required fields");
    return;
  }

  User.find({ username })
    .then((resp) => {
      if (resp.length != 0) {
        next("This username is already taken");
        return;
      }
      let salt = bcrypt.genSaltSync(saltRounds);
      let passwordEnc = bcrypt.hashSync(password, salt);

      return User.create({ username, email, password: passwordEnc });
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => next(err));
});

//POST -> http://localhost:5005/auth/login
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username == "" || password == "") {
    next("Please fill all the required fields");
    return;
  }

  User.find({ username })
    .then((resp) => {
      if (resp.length != 1) {
        next("wrong credentials");
        return;
      }
      if (!bcrypt.compareSync(password, resp[0].password)) {
        next("wrong credentials");
        return;
      }
      //we consider the user correctly authenticated:
      const payload = { username };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "24h",
      });
      res.json({ authToken });
    })
    .catch((err) => next(err));
});

//GET -> http://localhost:5005/auth/verify
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json(req.payload);
});


// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("picture"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
