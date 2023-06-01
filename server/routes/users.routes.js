const router = require("express").Router();
const User = require("../models/User.model");

router.get("/:userId", (req, res, next) => {
  let { userId } = req.params;
  console.log('#########', userId)
  User.findById(userId)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

router.post("/:userId/edit", (req, res, next) => {
    let { userId } = req.params;
    //get new userdetails

    User.findByIdAndUpdate(userId)
    .then(resp => {
        //update user
    })
      .catch((err) => next(err));
  });

module.exports = router;
