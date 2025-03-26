const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Playlist = require("../models/playlist");

const resolvers = {
  Query: {
    getUserPlaylists: async (_, __, context) => {
      if (!context.userId) throw new Error("Not authenticated");
      const user = await User.findById(context.userId).populate("savedPlaylists");
      return user.savedPlaylists;
    },

    getPlaylistById: async (_, { id }) => {
      return await Playlist.findById(id).populate("sharedBy");
    },

    searchUsers: async (_, { username }) => {
      return await User.find({
        username: new RegExp(username, "i"),
      }).select("-password");
    },

    getUserProfile: async (_, { username }) => {
      return await User.findOne({ username })
        .populate("savedPlaylists")
        .populate("followers", "username")
        .populate("following", "username");
    },

    getCurrentUser: async (_, __, context) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await User.findById(context.userId)
        .populate("savedPlaylists")
        .populate("following", "username");
    },
  },

  Mutation: {
    registerUser: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("Username already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      return { message: "Registration successful!" };
    },

    loginUser: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new Error("Incorrect password");

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || "YOUR_SECRET_KEY",
        { expiresIn: "1d" }
      );

      return {
        token,
        message: "Login successful!",
      };
    },

    savePlaylistToUser: async (_, { url, title }, context) => {
      if (!context.userId) throw new Error("Not authenticated");

      const newPlaylist = new Playlist({
        url,
        title,
        sharedBy: context.userId,
      });

      await newPlaylist.save();

      await User.findByIdAndUpdate(context.userId, {
        $addToSet: { savedPlaylists: newPlaylist._id },
      });

      return newPlaylist;
    },

    unsavePlaylistFromUser: async (_, { id }, context) => {
      if (!context.userId) throw new Error("Not authenticated");

      await User.findByIdAndUpdate(context.userId, {
        $pull: { savedPlaylists: id },
      });

      await Playlist.findByIdAndDelete(id);

      return { message: "Playlist unsaved" };
    },

    followUser: async (_, { targetUsername }, context) => {
      if (!context.userId) throw new Error("Not authenticated");

      const currentUser = await User.findById(context.userId);
      const targetUser = await User.findOne({ username: targetUsername });

      if (!currentUser || !targetUser) throw new Error("User not found");
      if (currentUser.id === targetUser.id) throw new Error("Cannot follow yourself");

      if (!currentUser.following.includes(targetUser._id)) {
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
        await currentUser.save();
        await targetUser.save();
      }

      return targetUser;
    },

    unfollowUser: async (_, { targetUsername }, context) => {
      if (!context.userId) throw new Error("Not authenticated");

      const currentUser = await User.findById(context.userId);
      const targetUser = await User.findOne({ username: targetUsername });

      if (!currentUser || !targetUser) throw new Error("User not found");

      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);

      await currentUser.save();
      await targetUser.save();

      return targetUser;
    },
  },
};

module.exports = resolvers;
