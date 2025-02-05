import User, { UserDocument } from "../models/User.js";
import { BookDocument } from "../models/Book.js";
import { signToken, AuthenticationError } from '../services/auth.js';

interface MyBooksArgs {
    _id: any;
    usermane: string;
}

interface LoginUserArgs {
    email: string;
    password: string;
}



const resolvers = {
    Query: {
        me: async (_parent: any, _args: MyBooksArgs, context: any): Promise<UserDocument | null> => {        
        if (context.user) {
          const user = await User.findById(context.user._id).select('-__v -password');
          return user;
        }
        throw new AuthenticationError('Not authenticated');
      },
    },
  
    Mutation: {
      addUser: async (_parent: any, { username, email, password }: any) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },
  
      login: async (_parent: any, { email, password }: LoginUserArgs) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const isCorrectPassword = await user.isCorrectPassword(password);
  
        if (!isCorrectPassword) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user.username, user.email, user._id);
        
        return { token, user };
      },
  
      saveBook: async (_parent: any, {input}: {input: BookDocument}, context: { user: any }) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: input } }, 
            { new: true, runValidators: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('Not authenticated');
      },
  
      removeBook: async (_parent: any, removeBookArgs: BookDocument, context: { user: any }) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId: removeBookArgs.bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('Not authenticated');
      },
    },
  };

  export default resolvers;