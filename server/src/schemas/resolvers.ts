import User from '../models/User';

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_: any, { _id }: { _id: string }) => {
      return await User.findById(_id);
    },
  },
  Mutation: {
    addUser: async (_: any, { username, email }: { username: string; email: string }) => {
      return await User.create({ username, email });
    },
    updateUser: async (_: any, { _id, username, email }: { _id: string; username?: string; email?: string }) => {
      return await User.findByIdAndUpdate(_id, { username, email }, { new: true });
    },
    deleteUser: async (_: any, { _id }: { _id: string }) => {
      return await User.findByIdAndDelete(_id);
    },
  },
};

export default resolvers;
