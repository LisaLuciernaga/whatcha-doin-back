const router = require("express").Router();
const isAuthenticated = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const List = require("../models/List.model")

//http://localhost:5005/users/:username
router.get("/:username", (req, res, next) => {
  //removed isAuthenticated because needs to be accessible from other users as well changeLater
  let { username } = req.params;
  User.findOne({ username: username })
    .populate("eventsCreated eventsJoined friendsPending inviteLists friendsConfirmed notifications" )
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/users/:userID 
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
router.post("/:userId/edit", isAuthenticated, (req, res, next) => {
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

module.exports = router;
