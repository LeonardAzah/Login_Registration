const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    SuperAdmin: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshtoken: String,
});

module.exports = mongoose.model("User", userSchema);
