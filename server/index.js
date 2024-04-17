if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// tambahan
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");

const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const httpServer = http.createServer(app);

const { typeDefs: userTypeDefs, resolvers: userResolvers } = require("./schemas/user");

const { typeDefs: followTypeDefs, resolvers: followResolvers } = require("./schemas/follow");

const { typeDefs: postTypeDefs, resolvers: postResolvers } = require("./schemas/post");

const { verifyToken } = require("./helpers/token");
const User = require("./models/User");
const { ObjectId } = require("mongodb");

const server = new ApolloServer({
   typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
   resolvers: [userResolvers, followResolvers, postResolvers],
   introspection: true,
   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});


(async () => {
   await server.start();

   app.use(
      "/",
      cors(),
      express.json(),
      expressMiddleware(server, {
         context: async ({ req, res }) => {
            return {
               auth: async () => {
                  const { authorization } = req.headers;
                  if (!authorization) throw new Error("Invalid token");

                  const [type, token] = authorization.split(" ");
                  if (type != "Bearer") throw new Error("Invalid token");

                  const decodeToken = verifyToken(token);
                  if (!decodeToken.id) throw new Error("Invalid token");

                  const userCollection = User.collection();
                  const options = {
                     projection: { password: 0 },
                  };
                  const user = await userCollection.findOne(
                     {
                        _id: new ObjectId(String(decodeToken.id)),
                     },
                     options
                  );
                  if (!user) throw new Error("Invalid token");

                  return { _id: user._id, username: user.username };
               },
            };
         },
      })
   );

   await new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 3000 }, resolve));
   console.log(`🚀 Server ready at http://localhost:3000/`);
})();

// startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({ req, res }) => {
//     return {
//       auth: async () => {
//         const { authorization } = req.headers;
//         if (!authorization) throw new Error("Invalid token");

//         const [type, token] = authorization.split(" ");
//         if (type != "Bearer") throw new Error("Invalid token");

//         const decodeToken = verifyToken(token);
//         if (!decodeToken.id) throw new Error("Invalid token");

//         const userCollection = User.collection();
//         const options = {
//           projection: { password: 0 },
//         };
//         const user = await userCollection.findOne(
//           {
//             _id: new ObjectId(String(decodeToken.id)),
//           },
//           options
//         );
//         // console.log(user);
//         if (!user) throw new Error("Invalid token");

//         return { _id: user._id, username: user.username };
//       },
//     };
//   },
// }).then(({ url }) => {
//   console.log(`🚀  Server ready at: ${url}`);
// });
