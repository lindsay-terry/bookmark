const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Query logged in user data
        me: async(parent, args, context) => {
            console.log('QUERYING ME', context.user);
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).populate('savedBooks');
                return userData;
            }
            throw new Error(' Unable to find user data.');
        },
    },

    Mutation: {
        // Create user
        createUser: async (parent, { username, email, password }) => {
            try {
                if (!username || !email || !password) {
                    throw new Error('Missing required fields.');
                }
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
            try {
                const user = await User.findOne({ email });
  
                if (!user) {
                    throw new Error('Incorrect email or password.')
                }

                const correctPassword = await user.isCorrectPassword(password);

                if (!correctPassword) {
                    throw new Error('Incorrect email or password.');
                }

                const token = signToken(user);
    
                return { token, user };
            } catch (error) {
                console.error('Login error', error.message);
            }
        },
        // Save Book
        saveBook: async (parent, { book }, context) => {            
            // Check logged in
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                ).populate('savedBooks');
                console.log('UPDATED USER: updatedUser')
                return updatedUser;
            }
            throw new Error('Error updating user with saved book information.');
        },
        // Delete Book
        deleteBook: async (parent, { bookId }, context) => {
            console.log('DELETING BOOK TRYING TO', context, bookId)
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new Error('Error removing book data from user.');
        },
    },
};

module.exports = resolvers;