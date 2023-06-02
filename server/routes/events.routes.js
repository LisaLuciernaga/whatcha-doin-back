const router = require("express").Router();
const User = require("../models/User.model");
const { DateTime } = require("luxon");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

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
router.post("/events/create", isLoggedIn, (req, res, next) => {
    const { title, description, icon, dateTime, location, coordinates} = req.body;
    let pendingJoiners = [];

    if (req.body.pendingJoiners && typeof req.body.pendingJoiners == "string") {
      pendingJoiners = [req.body.pendingJoiners];
    }
    if (req.body.pendingJoiners && typeof req.body.pendingJoiners == "object") {
      pendingJoiners = req.body.pendingJoiners;
    }
  
    const newEvent = {
      title,
      creator: req.session.currentUser._id,
      description,
      icon,
      dateTime,
      location,
      pendingJoiners, // Array of User IDs
    };
  
    Event.create(newEvent) // create the habit for current user
      .then((event) => {
        // console.log("New habit saved:", habit);
        return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { eventsCreated: event._id } }); // Connect habit to User document
      })
      .then(() => {
            Event.find(pendingJoiners) 
        
          }
      )
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        next(err);
      });
  });

  // POST DELETE
  router.post("/events/:eventId/delete", isLoggedIn, (req, res, next) => {
    let { eventId } = req.params;
    Event.findByIdAndDelete(eventId)
      .then((event) => {
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  });

  // POST UPDATE
  router.post("/events/:eventId/update", isLoggedIn, (req, res, next) => {
    const { title, description, icon, dateTime, location, coordinates } = req.body;
    let { eventId } = req.params;

    Event.findByIdAndUpdate(eventId, { title, description, icon, dateTime, location, coordinates }, { new: true })
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  });

  // POST REJECT
  router.post('/events/:eventId/reject', isLoggedIn, (req, res, next) => {
    let { eventId } = req.params;

    User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { eventsPending: eventId}})
    .then(() => {})
    .catch((err) => next(err))
  })


  // POST ACCEPT
  router.post('/events/:eventId/accept', isLoggedIn, (req, res, next) => {
    let { eventId } = req.params;

    User.findByIdAndUpdate(req.session.currentUser._id, { $push: { eventsJoined: eventId } })
    .then(() => {})
    .catch((err) => next(err))
  })


  // POST UNJOIN
  router.post('/events/:eventId/unjoin', isLoggedIn, (req, res, next) => {
    let { eventId } = req.params;
    User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { eventsJoined: eventId}})
    .then(() => {})
    .catch((err) => next(err))
  })

  module.exports = router;