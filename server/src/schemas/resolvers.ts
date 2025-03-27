import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY || '';
const tokenExpiration = '2h';

const signToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, 
      email: user.email, 
      username:user.username },
    secret,
    { expiresIn: tokenExpiration }
  );
};

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const user = await User.findById(context.user._id).populate("savedBooks");

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  },
  
  Mutation: {
    // User login
    login: async (_: any, { email, password }: 
      { email: string; password: string }) => {
        console.log(email, password)

      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = jwt.sign(
        { _id: user._id}, 
        process.env.JWT_SECRET_KEY || '', 
        { expiresIn: '2h' });

      return { token, user };
    },

    // Register a new user
    addUser: async (_: any, { username, email, password }: 
      { username: string; email: string; password: string }) => {

      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Save a book to user's list
    saveBook: async (_: any, { book }: { book: any }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to save books');
      }
    
      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: book } }, // Prevents duplicates
          { new: true }
        );
    
        if (!updatedUser) {
          throw new Error('User not found!');
        }
    
        return updatedUser;
      } catch (err) {
        console.error('Error in saveBook resolver:', err);
        throw new Error('Failed to save book. Please try again.');
      }
    },

    // Remove a book from user's list
    removeBook: async ( { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to remove books');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate("savedBooks");
    
        if (!updatedUser) {
          throw new Error("Couldn't find user with this ID!");
        }
    
        return updatedUser;
      } catch (err) {
        console.error('Error removing book:', err);
        throw new Error('Failed to remove book. Please try again.');
      }
    },
  },
};

export default resolvers;
