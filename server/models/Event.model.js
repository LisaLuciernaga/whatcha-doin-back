const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectID, ref: "User" },
  description: { type: String },
  icon: { type: String },
  date: { type: Date },
  time: { type: String },
  location: { type: String },
  pendingJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  confirmedJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  shareable: { type: Boolean },
});

const Event = model("event", eventSchema);

module.exports = Event;
