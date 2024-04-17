const Post = require("../models/Post");

const typeDefs = `#graphql
  # Schema
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    detailAuthor: Author
  }

  type Author {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Comment {
    postId: ID
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }
  
  type Message {
    message: String
  }

  type Query {
    getDataPosts: [Post]
    getDataPostById(_id: ID): Post
  }

  input dataPost {
    content: String
    tags: String
    imgUrl: String
  }

  # Endpoint
  type Mutation{
    post(dataPost: dataPost): Post
    comment(content: String, postId: String): Comment
    like(postId: ID): Message
  }
`;

const resolvers = {
   Query: {
      getDataPosts: async (parent, args, contextValue) => {
         try {
            await contextValue.auth();
            const posts = await Post.getPosts();
            return posts;
         } catch (error) {
            throw error;
         }
      },
      getDataPostById: async (parent, args, contextValue) => {
         try {
            await contextValue.auth();

            const { _id: id } = args;
            const post = await Post.getPostById(id);
            return post;
         } catch (error) {
            throw error;
         }
      },
   },
   Mutation: {
      post: async (parent, args, contextValue) => {
         try {
            console.log("masuk sini");
            const user = await contextValue.auth();

            const { dataPost } = args;
            const result = await Post.createPost({
               ...dataPost,
               authorId: user._id,
            });

            return result;
         } catch (error) {
            throw error;
         }
      },
      comment: async (parent, args, contexValue) => {
         try {
            const user = await contexValue.auth();

            const { content, postId } = args;
            const result = await Post.addComent({
               content,
               username: user.username,
               postId,
            });
            return result;
         } catch (error) {
            throw error;
         }
      },
      like: async (parent, args, contexValue) => {
         try {
            const user = await contexValue.auth();

            const { postId } = args;
            const result = await Post.addLike({ username: user.username, postId });

            return { message: result };
         } catch (error) {
            console.log(error);
            throw Error;
         }
      },
   },
};

module.exports = { typeDefs, resolvers };
