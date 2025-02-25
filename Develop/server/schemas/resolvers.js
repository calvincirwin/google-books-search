const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) throw new Error("Not logged in");
      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    // ✅ Register a new user
    addUser: async (_, { username, email, password }) => {
      try {
        console.log("Attempting to create user...");

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists. Please choose another.");
        }

        const user = await User.create({ username, email, password });
        console.log("✅ User created:", user);

        const token = signToken(user);
        console.log("✅ Token generated:", token);

        return { token, user };
      } catch (err) {
        console.error("❌ Error in addUser:", err);
        return null;
      }
    },

    // ✅ Log in a user (Assumes you have password hashing)
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) throw new Error("Incorrect password");

      const token = signToken(user);
      return { token, user };
    },

    // ✅ Save a book for the logged-in user
    saveBook: async (_, { bookId, authors, description, title, image, link }, context) => {
      if (!context.user) throw new Error("Not logged in");

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
        { new: true }
      );

      console.log("✅ Book saved:", { bookId, title });

      return updatedUser;
    },

    // ✅ Remove a book from savedBooks
    removeBook: async (_, { bookId }, context) => {
      if (!context.user) throw new Error("Not logged in");

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      console.log("✅ Book removed:", bookId);

      return updatedUser;
    },
  },
};

// ✅ Correct export statement (NO extra braces or duplicate exports)
module.exports = resolvers;
