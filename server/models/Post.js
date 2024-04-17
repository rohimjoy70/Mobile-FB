const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const redis = require("../config/redis");

class Post {
  static collection() {
    return database.collection("Posts");
  }

  static async createPost({ content, tags, imgUrl, authorId }) {
    const postsCollection = this.collection();

    const tmpTags = tags.split(" ");
    tags = tmpTags.filter((el) => {
      return el != "";
    });

    const newPost = {
      content,
      tags,
      imgUrl,
      authorId: authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      likes: [],
    };

    const result = await postsCollection.insertOne(newPost);
    await redis.del("post:all");
    return {
      _id: result.insertedId,
      ...newPost,
    };
  }

  static async getPosts() {
    const postsCollection = this.collection();

    const agg = [
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "detailAuthor",
        },
      },
      {
        $unwind: {
          path: "$detailAuthor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "detailAuthor.password": 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const postCache = await redis.get("post:all");

    if (postCache) {
      // console.log("ini dari cahce redis");
      const postData = JSON.parse(postCache);
      return postData;
    }
    // console.log("ini dari mongodb");
    const posts = await postsCollection.aggregate(agg).toArray();
    await redis.set("post:all", JSON.stringify(posts));

    return posts;
  }

  static async getPostById(id) {
    const postsCollection = this.collection();
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "detailAuthor",
        },
      },
      {
        $unwind: {
          path: "$detailAuthor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "detailAuthor.password": 0,
        },
      },
    ];

    const post = await postsCollection.aggregate(agg).toArray();
    return post[0];
  }

  static async addComent({ content, username, postId }) {
    const postsCollection = this.collection();
    console.log("masuk siniii<<<<<");
    const newComent = {
      content,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(String(postId)) },
      { $addToSet: { comments: newComent } }
    );

    await redis.del("post:all");
    return {
      ...newComent,
      postId,
    };
  }

  static async addLike({ username, postId }) {
    const postsCollection = this.collection();

    const post = await postsCollection
      .find({ _id: new ObjectId(String(postId)) })
      .toArray();
    let { likes } = post[0];

    if (likes.length > 0) {
      const hasLike = likes.filter((el) => el.username == username);
      const indexLike = likes.indexOf(hasLike[0]);
      if (indexLike >= 0) {
        likes.splice(indexLike, 1);
        await postsCollection.updateOne(
          { _id: new ObjectId(String(postId)) },
          { $set: { likes: likes } }
        );
        await redis.del("post:all");
        return "You unlike this post";
      }
    }

    const newLike = {
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postsCollection.updateOne(
      { _id: new ObjectId(String(postId)) },
      { $addToSet: { likes: newLike } }
    );
    await redis.del("post:all");
    return "You like this post";
  }
}

module.exports = Post;
