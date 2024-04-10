import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/create-error.js";

/* REGISTER USER */
export const register = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(value);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(value.password, salt);

    const newUser = new User({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: passwordHash,
      picturePath: value.picture.path,
      friends: value.friends,
      location: value.location,
      occupation: value.occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};

/* LOGIN */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      createError(400, "Invalid user");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError(400, "Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};
