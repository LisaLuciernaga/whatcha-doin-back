const router = require("express").Router();
const User = require("../models/User.model");

//http://localhost:5005/friendstatus/:friendId/accept
router.post("/:friendId/accept", (req, res, next) => {
  //isAuthenticated changeLater, change userId to the actual parameters
  // let currentUserId = req.payload.userId;
  let { friendId } = req.params;

  User.findByIdAndUpdate("64789d54e2ff6ce35af93694", {
    //if(!User.friendsConfirmed.includes(friendId))
    // else console.log("Friendrequest already accepted")
    $push: { friendsConfirmed: friendId },
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/remove
router.post("/:friendId/remove", (req, res, next) => {
  //isAuthenticated changeLater, change userId to the actual parameters
  let { friendId } = req.params;
  User.findByIdAndUpdate("64789d54e2ff6ce35af93694", {
    $pull: { friendsConfirmed: friendId },
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/sendrequest
router.post("/:friendId/sendrequest", (req, res, next) => {
  //isAuthenticated changeLater, change userId to the actual parameters
  let { friendId } = req.params;
  User.findByIdAndUpdate("64789d54e2ff6ce35af93694", {
    $push: { friendsPending: friendId },
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

module.exports = router;
