const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  creator: { type: Schema.Types.ObjectID, ref: "User" },
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectID, ref: "User" }],
});

const List = model("list", listSchema);

module.exports = List;
