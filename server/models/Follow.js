const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class Follow {
   static collection() {
      return database.collection("Follows");
   }

   static async followUser({ followingId, followerId }) {
      const followCollection = this.collection();
      const followData = {
         followingId: new ObjectId(String(followingId)), // yang difollow
         followerId: new ObjectId(String(followerId)), // yang ngefollow
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      const listFollow = await followCollection.find({ followingId: new ObjectId(String(followingId)) }).toArray();

      if (listFollow.length > 0) {
         const hasFollow = listFollow.filter((el) => {
            return String(el.followerId) == followerId;
         });

         if (hasFollow.length > 0) {
            await followCollection.deleteOne({ _id: hasFollow[0]._id });

            return {
               message: "You unfollow this account",
               _id: hasFollow[0]._id,
               ...followData,
            };
         }
      }

      const result = await followCollection.insertOne(followData);
      return {
         message: "You follow this account",
         _id: result.insertedId,
         ...followData,
      };
   }

   static async getFollowers(id) {
      const follows = database.collection("Follows");
      const agg = [
         {
            $match: {
               followingId: new ObjectId("6606d3a0470ba59e8a4ad580"),
            },
         },
         {
            $lookup: {
               from: "Users",
               localField: "followerId",
               foreignField: "_id",
               as: "detailFollower",
            },
         },
         {
            $unwind: {
               path: "$detailFollower",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $project: {
               "detailFollower.password": 0,
            },
         },
         {
            $group: {
               _id: "$detailFollower",
            },
         },
      ];

      const follower = await follows.aggregate(agg).toArray();
      console.log(follower);
      return follower;
   }

   static async deleteFollower({ followerId, idLogin }) {
      const followCollection = this.collection();

      await followCollection.deleteOne({
         $and: [
            {
               followingId: new ObjectId(String(idLogin)),
            },
            {
               followerId: new ObjectId(String(followerId)),
            },
         ],
      });
      return "Success delete follower";
   }
}

module.exports = Follow;
