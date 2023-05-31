const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  picture: {
    type: String,
    default:
      "https://res.cloudinary.com/dqzjo5wsl/image/upload/v1684481335/habit-pics/tbeshupek9snljclqogf.png",
  },
  friends: { type: [] },
  friendLists: [{ type: Schema.Types.ObjectID, ref: "List" }],
  pendingFriendships: [{ type: Schema.Types.ObjectID, ref: "User" }],
  notifications: [{ type: Schema.Types.ObjectID, ref: "Notification" }],
  role: { type: String, enum: ["newbie", "pro"], default: "newbie" },
});

const User = model("User", userSchema);

module.exports = User;
