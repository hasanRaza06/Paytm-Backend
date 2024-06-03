const express = require("express");
const JWT_Secret = require("./../config");
const router = express.Router();
const { signUpValidator,signInValidator,updateValidator} = require("./zod");
const {User,Account} = require("./../db");
const jwt=require("jsonwebtoken");
const JWT_SECRET = require("./../config");
const authMiddleware=require("./../middleware");

//signUp Route

router.post("/signup", async (req, res) => {
  const validate = signUpValidator.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({
      message: "Signup credentials failed",
    });
  }
  const userExists = await User.findOne({
    username: req.body.username,
  });
  if (userExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    // give some random money when creating an account
    await Account.create({
      userId: user._id,
      balance: Math.floor(Math.random() * 10000),
    });

    const token=jwt.sign({
      userId:user._id,
      name:user.firstname
    },JWT_SECRET);

    res.status(201).json({
      message: "User created successfully!",
      name:firstname,
      token:token
    });
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//signIn Route

router.post("/signin", async (req, res) => {
  const validate = signInValidator.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({
      message: "Incorrect Inputs",
    });
  }
  const userExist = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (userExist) {
    const token = jwt.sign(
      {
        userId: userExist._id,
        name:userExist.firstname
      },
      JWT_SECRET);
    return res.json({
      message: "User signIn Successful!",
      name:userExist.firstname,
      token: token,
    });
  }
  res.status(401).json({
    message: "Check your username and password and try again",
  });
});

//update Route

router.put("/update", authMiddleware, async (req, res) => {
  // const validate = updateValidator.safeParse(req.body);
  // if (!validate.success) {
  //   return res.status(400).json({
  //     message: "Error while updating information",
  //   });
  // }
  try {
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
      message: "User Updated Successfully!",
    });
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// find Users

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const regexFilter = new RegExp(filter, 'i');  // Case-insensitive regex
  try {
    const users = await User.find({
      $or: [
        {
          firstname: {
            $regex: regexFilter
          },
        },
        {
          lastname: {
            $regex: regexFilter
          },
        },
      ],
    });

    res.json({
      users: users.map((u) => ({
        userId:u._id,
        username: u.username,
        firstname: u.firstname,
        lastname: u.lastname,
      }))
    });
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
