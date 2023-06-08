const createNotification = (sentBy, type, eventId) => {
  let currentUserId = req.payload.userId;

  let newNotification = {
    sentBy,
    type,
    eventId,
  };
  Notification.create(newNotification)
    .then((notification) => {
      return User.findByIdAndUpdate(
        { _id: currentUserId },
        { $push: { notifications: notification._id } }
      );
    })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
};
