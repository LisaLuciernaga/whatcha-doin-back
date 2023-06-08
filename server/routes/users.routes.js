const router = require("express").Router();
const isAuthenticated = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const List = require("../models/List.model")
const fileUploader = require("../config/cloudinary.config")

//http://localhost:5005/users/:username
router.get("/:username", (req, res, next) => {
  //removed isAuthenticated because needs to be accessible from other users as well changeLater
  let { username } = req.params;
  User.findOne({ username: username })
    .populate("eventsCreated eventsJoined eventsPending friendsPending inviteLists friendsConfirmed notifications" )
    .populate({
      path:"inviteLists",
      populate: {
        path: "users"
      }
    })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/users/:username/raw
// THIS ONE IS ALSO NOT POPULATED
// We need one unpopulated GET by username for when retrieving info of user profiles. 
router.get("/:username/raw", (req, res, next) => {
  //removed isAuthenticated changeLater
  let { username } = req.params;
  User.findOne({ username: username })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/users/:userId/edit
router.post("/:userId/edit", (req, res, next) => {
  //isAuthenticated changeLater
  let { userId } = req.params;
  // let { userId } = req.payload;
  let { user } = req.body;

  User.findByIdAndUpdate(userId, user)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/users/:userId/upload
router.post("/:userId/upload", fileUploader.single("image"), (req, res, next) => {
  let { userId } = req.params;
  //if there was an image file uploaded in cloudinary, extracts the path so that it can be stored in the database
  let picture = '';
  if (req.file) {
      picture = req.file.path;
  }  
  User.findByIdAndUpdate(userId, {picture: picture})
  .then((resp) => {
    res.json(resp);
  })
  .catch((err) => next(err));
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
