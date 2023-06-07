const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/jwt.middleware");

//http://localhost:5005/friendstatus/:friendId/accept
router.post("/:friendId/accept", isAuthenticated, (req, res, next) => {
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;

  User.findByIdAndUpdate(currentUserId, {
    //if(!User.friendsConfirmed.includes(friendId))
    // else console.log("Friendrequest already accepted")
    $push: { friendsConfirmed: friendId },
    $pull: { friendsPending: friendId },
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/remove
router.post("/:friendId/remove", isAuthenticated, (req, res, next) => {
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;
  User.findByIdAndUpdate(currentUserId, {
    $pull: { friendsConfirmed: friendId },
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/sendrequest
router.post("/:friendId/sendrequest", isAuthenticated, (req, res, next) => {
  //isAuthenticated changeLater, change userId to the actual parameters
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;
  User.findById(friendId).then((user) => {
    if (!user.friendsPending.includes(currentUserId)) {
      User.findByIdAndUpdate(friendId, {
        $push: { friendsPending: currentUserId },
      })
        .then((resp) => {
          res.json(resp);
        })
        .catch((err) => next(err));
    } else if (user.friendsPending.includes(currentUserId)) {
      res.json("friendship already requested");
      return;
    }
  });
});

module.exports = router;
