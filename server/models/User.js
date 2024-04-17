const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashPassword, checkPassword } = require("../helpers/hash");
const { signToken } = require("../helpers/token");
const { validateEmail, validatePassword } = require("../helpers/validate");

class User {
  static collection() {
    return database.collection("Users");
  }

  static async register(inputUser) {
    const userCollection = this.collection();
    if (!inputUser.name) throw new Error("Full name is required");
    if (!inputUser.username) throw new Error("Username is required");
    if (!inputUser.email) throw new Error("Email is required");
    if (!inputUser.password) throw new Error("Password is required");

    const checkEmail = validateEmail(inputUser.email);
    if (!checkEmail) throw new Error("Invalid email format");

    const checkPwd = validatePassword(inputUser.password);
    if (!checkPwd) throw new Error("Password minimum 4 character");

    const findEmail = await userCollection.findOne({ email: inputUser.email });
    console.log(findEmail, "email");
    if (findEmail) throw new Error("Email already used");

    const findUsername = await userCollection.findOne({
      username: inputUser.username,
    });
    if (findUsername) throw new Error("Username already used");

    const newUser = {
      ...inputUser,
      password: hashPassword(inputUser.password),
    };

    const result = await userCollection.insertOne(newUser);

    return {
      _id: result.insertedId,
      ...inputUser,
    };
  }

  static async login(inputUser) {
    const userCollection = this.collection();
    if (!inputUser.emailOrUsername)
      throw new Error("Email or username is required");

    if (!inputUser.password) throw new Error("Password is required");

    let user = await userCollection.findOne({
      email: inputUser.emailOrUsername,
    });
    if (!user) {
      user = await userCollection.findOne({
        username: inputUser.emailOrUsername,
      });
    }
    if (!user) throw new Error("Your account not registered");

    const isValid = checkPassword(inputUser.password, user.password);
    if (!isValid) throw new Error("Invalid password");

    const token = signToken({ id: user._id, username: user.username });
    return { token, username: user.username };
  }

  static async getUserByUsername({ username, idLogin }) {
    const userCollection = this.collection();

    const option = {
      projection: { password: 0 },
    };

    let user = await userCollection
      .find(
        {
          username: { $regex: username },
        },
        option
      )
      .toArray();

    user = user.filter((el) => {
      if (String(el._id) != String(idLogin)) {
        return el;
      }
    });
    return user;
  }

  static async getUserById({ id }) {
    const userCollection = this.collection();

    const agg = [
      {
        $match: {
          _id: new ObjectId(String(id)),
        },
      },
      {
        $lookup: {
          from: "Follows",
          localField: "_id",
          foreignField: "followingId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "follower.followerId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
      {
        $lookup: {
          from: "Follows",
          localField: "_id",
          foreignField: "followerId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "following.followingId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ];

    const profile = await userCollection.aggregate(agg).toArray();
    return profile[0];
  }
}

module.exports = User;
