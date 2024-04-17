const User = require("../models/User");

const typeDefs = `#graphql
  # Schema (getUserDataByUsername, )
  type User {
    _id: ID
    name: String
    username: String
    email: String
  }

  # Schema (getUserDataByUsername, )
  type Profile {
    _id: ID
    name: String
    username: String
    email: String
    follower: [FollowUser]
    followerDetail: [User]
    following: [FollowUser]
    followingDetail: [User]
  }

  type FollowUser {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  # Login
  type Token {
    username: String
    access_token: String
  }

  # Endpoint
  type Query {
    getUserDataByUsername(username: String): [User]
    getUserDataById: Profile
  }

  # Register
  input registerData {
    name: String,
    username: String,
    email: String,
    password: String
  }
  
  # Input Login
  input loginData {
    emailOrUsername: String,
    password: String
  }

  # Endpoint
  type Mutation {
    register(registerData: registerData): User
    login(loginData: loginData): Token
  }
`;

const resolvers = {
  Query: {
    getUserDataByUsername: async (parent, args, contexValue) => {
      try {
        const user = await contexValue.auth();

        const { username } = args;
        const result = await User.getUserByUsername({
          username,
          idLogin: user._id,
        });
        return result;
      } catch (error) {
        throw error;
      }
    },
    getUserDataById: async (parent, args, contexValue) => {
      try {
        const user = await contexValue.auth();

        const result = await User.getUserById({ id: user._id });
        return result;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    register: async (parent, args) => {
      try {
        const { registerData } = args;

        const user = await User.register(registerData);
        return user;
      } catch (error) {
        throw error;
      }
    },
    login: async (parent, args) => {
      try {
        const { loginData } = args;
        const result = await User.login(loginData);
        return { username: result.username, access_token: result.token };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
