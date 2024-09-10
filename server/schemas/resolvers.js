const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).populate('book');
                return userData;
            }
        }
    },

    Mutation: {
        // Create user
        createUser: async (parent, { username, email, password }) => {
            try {
                const user = await User.create({ username, email, password });

                const token = signToken(user);

                return { token, user };
            } catch (error) {
                console.error('Error creating user', error);
                throw new Error('Failed to create a user.');
            };
        },
        // Login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('Incorrect username or password.');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new Error('Incorrect username or password.');
            }

            const token = signToken(user);

            return { token, user };
        },
        // Save Book
        saveBook: async (parent, { title, bookId }, context) => {
            // Check logged in
            if (context.user) {
                const book = { title, bookId };
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $push: { savedBooks: book } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
        },
        // Delete Book
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
        },
    },
};

module.exports = resolvers;