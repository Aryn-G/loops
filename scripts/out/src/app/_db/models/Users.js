"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UsersSchema = new mongoose_1.default.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["No", "Student", "Loops", "Admin"],
    default: "No",
  },
  linked: {
    type: Boolean,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
exports.default =
  mongoose_1.default.models.Users ||
  mongoose_1.default.model("Users", UsersSchema);
