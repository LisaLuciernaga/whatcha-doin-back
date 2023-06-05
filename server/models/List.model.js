const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  title: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectID, ref: "User" }],
});

const List = model("list", listSchema);

module.exports = List;
