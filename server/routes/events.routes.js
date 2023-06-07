const router = require("express").Router();
const User = require("../models/User.model");
// const { DateTime } = require("luxon");

const isAuthenticated = require("../middleware/jwt.middleware");

const Event = require("../models/Event.model");
const { Router } = require("express");

//CLOUDINARY
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "habit-pics",
//     allowed_formats: ["jpg", "png", "jpeg", "webp", "png"],
//   },
// });

// POST CREATE
// isAuthenticated changeLater
router.post("/create", (req, res, next) => {
  let { title, description, creator, icon, dateTime, location, coordinates, pendingJoiners } = req.body;

  if (req.body.pendingJoiners && typeof req.body.pendingJoiners == "string") {
    pendingJoiners = [req.body.pendingJoiners];
  }
  if (req.body.pendingJoiners && typeof req.body.pendingJoiners == "object") {
    pendingJoiners = req.body.pendingJoiners;
  }

  let createdEvent = {};

  const newEvent = { // changeLater: Every field should equal those retrieved from the req.body on the first line of this route's code, except for the creator.
    title,
    creator, 
    description,
    icon: "img",
    dateTime,
    location,
    coordinates,
    pendingJoiners, // invited users.
  };

  // 1. First thing is creating the event.
  Event.create(newEvent)
    .then((event) => {
      // 2. We insert the event ID in the array of events created by the logged-in user.
      createdEvent = event;
      return User.findByIdAndUpdate("6479ff1dc2ff688d4a41f2c5", {
        //changeLater. This hardcoded ID must be the current logged-in user ID and we should be able to access it through the payload?
        $push: { eventsCreated: createdEvent._id },
      });
    })
    .then((resp) => {
      // 3. We insert the event ID in the array of "eventsPending" of every user who was invited to the event.
      createdEvent.pendingJoiners.forEach((invitedUser) => {
        User.findByIdAndUpdate(invitedUser, {
          $push: { eventsPending: createdEvent._id },
        }).catch((err) => next(err));
      });
    })
    .then((resp) => {
      console.log("#####:", createdEvent);
      res.json(createdEvent);
    })
    .catch((err) => next(err));
});

// POST DELETE
router.post("/:eventId/delete", (req, res, next) => {
  let { eventId } = req.params;
  Event.findByIdAndDelete(eventId)
    .then((event) => {
      res.json(event);
    })
    .catch((err) => next(err));
});

// POST UPDATE
router.post("/:eventId/update", (req, res, next) => {
  const { title, description, icon, dateTime, location, coordinates } = req.body;
  let { eventId } = req.params;

  Event.findByIdAndUpdate(eventId, { title, description, icon, dateTime, location, coordinates }, { new: true })
    .then((event) => {
      res.json(event);
    })
    .catch((err) => next(err));
});

// POST REJECT
router.post("/:eventId/reject", (req, res, next) => {
  let { eventId } = req.params;

  User.findByIdAndUpdate(req.session.currentUser._id, {
    $pull: { eventsPending: eventId },
  })
    .then((event) => {
      res.json(event);
    })
    .catch((err) => next(err));
});

// POST ACCEPT
router.post("/:eventId/accept", (req, res, next) => {
  let { eventId } = req.params;

  User.findByIdAndUpdate(req.session.currentUser._id, {
    $push: { eventsJoined: eventId },
  })
    .then((event) => {
      res.json(event);
    })
    .catch((err) => next(err));
});

// POST UNJOIN
// changeLater
router.post("/:eventId/unjoin", (req, res, next) => {
  let { eventId } = req.params;

  User.findByIdAndUpdate("6479ece69f666d96171b88ed", {
    $pull: { eventsJoined: eventId },
  })
    .then(() => {
      return User.findByIdAndUpdate("6479ece69f666d96171b88ed", {
        $push: { eventsPending: eventId },
      });
    })
    .then(() => {
      return Event.findByIdAndUpdate(eventId, {
        $pull: { confirmedJoiners: "6479ece69f666d96171b88ed" },
      });
    })
    .then(() => {
      return Event.findByIdAndUpdate(eventId, {
        $push: { pendingJoiners: "6479ece69f666d96171b88ed" },
      });
    })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

module.exports = router;
