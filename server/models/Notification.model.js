const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectID, ref: "User" },
    sentBy: { type: Schema.Types.ObjectID, ref: "User" },
    type: { type: String, enum: ["friendReq", "friendAcc", "eventJoin"] },
    eventId: { type: Schema.Types.ObjectID, ref: "Event" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Notification = model("notification", notificationSchema);

module.exports = Notification;
