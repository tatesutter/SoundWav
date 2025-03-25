const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    savedPlaylists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
