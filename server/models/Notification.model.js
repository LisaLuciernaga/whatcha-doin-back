const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    sentBy: { type: Schema.Types.ObjectID, ref: "User" },
    type: {
      type: String,
      enum: ["friendReq", "friendAcc", "eventJoin", "comments"],
    },
    eventId: { type: Schema.Types.ObjectID, ref: "Event" },
    new: { type: Boolean, default: true },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Notification = model("notification", notificationSchema);

module.exports = Notification;
