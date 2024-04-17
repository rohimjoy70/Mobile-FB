const Follow = require("../models/Follow");

const typeDefs = `#graphql 
  # Schema (follow, getDataFollowers)
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
    message: String
  }

  type User {
    _id: ID
    name: String
    email: String
  }

  type Message {
    message: String
  }

  # Endpoint
  type Query {
    getDataFollowers(_id: ID): [Follow]
  }

  # Endpoint
  type Mutation {
    follow(followingId: ID): Follow
    delFollower(followerId: ID): Message
  }
`;

const resolvers = {
  Query: {
    getDataFollowers: async (parent, args, contexValue) => {
      try {
        const user = await contexValue.auth();
        const { _id: id } = args;
        const followers = await Follow.getFollowers(id);
        return followers;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    follow: async (parent, args, contexValue) => {
      try {
        const user = await contexValue.auth();
        const result = await Follow.followUser({
          ...args,
          followerId: user._id,
        });
        return result;
      } catch (error) {
        throw error;
      }
    },
    delFollower: async (parent, args, contexValue) => {
      try {
        const user = await contexValue.auth();
        const { followerId } = args;
        const result = await Follow.deleteFollower({
          followerId,
          idLogin: user._id,
        });
        return { message: result };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
