const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectID, ref: "User" },
  description: { type: String },
  icon: { type: String }, //enum, fontawesome (array off html tag)
  dateTime: { type: Date }, //use luxon
  location: { type: String },
  coordinates: {}, //coordinates (an object wit properties lat & lng)
  pendingJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  confirmedJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  // shareable: { type: Boolean },
  // comments: [{ type: Schema.Types.ObjectID, ref: "Comment" }]
});

const Event = model("event", eventSchema);

module.exports = Event;
