import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    addUser(username: String!, email: String!): User
    updateUser(_id: ID!, username: String, email: String): User
    deleteUser(_id: ID!): User
  }
`;

export default typeDefs;
