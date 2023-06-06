const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  picture: {
    type: String,
    default:
      "https://res.cloudinary.com/dqzjo5wsl/image/upload/v1684481335/habit-pics/tbeshupek9snljclqogf.png",
  },
  friendsConfirmed: [{ type: Schema.Types.ObjectID, ref: "User" }],
  inviteLists: [{ type: Schema.Types.ObjectID, ref: "List" }],
  friendsPending: [{ type: Schema.Types.ObjectID, ref: "User" }],
  notifications: [{ type: Schema.Types.ObjectID, ref: "Notification" }],
  role: { type: String, enum: ["newbie", "pro"], default: "newbie" },
  eventsCreated: [{ type: Schema.Types.ObjectID, ref: "Event" }],
  eventsJoined: [{ type: Schema.Types.ObjectID, ref: "Event" }],
  eventsPending: [{ type: Schema.Types.ObjectID, ref: "Event" }],
});

const User = model("User", userSchema);

module.exports = User;
