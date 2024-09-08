const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        getSingleUser: async(parent, { username }) => {
            const user = await User.findOne({
                $or: [{ _id }, { username }]
            });
            if (!user) throw new Error('User not found');
            return user;
        },
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
                throw new Error('Incorrect username or apssword.');
            }

            const token = signToken(user);

            return { token, user };
        },
        // Save Book
        saveBook: async (parent, { title }, context) => {
            const user = context.user;
            if (!user) throw new Error('Please sign in to save books.');

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: book._id } },
                { new: true }
            );

            return updatedUser;
        },
        // Delete Book
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const book = await Book.findOneAndDelete({
                    _id: bookId,
                    user: context.user.username,
                });

                await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $pull: { savedBooks: book._id } }
                );
                return user;
            }
        },
    },
};

module.exports = resolvers;