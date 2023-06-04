const router = require("express").Router();
const Notification = require("../models/Notification.model");

//http://localhost:5005/notifications/:notificationId/markread
router.post("/:notificationId/markread", (req, res, next) => {
  //isAuthenticated changeLater
  let { notificationId } = req.params;

  Notification.findByIdAndUpdate(notificationId, {
    new: false,
  })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});
