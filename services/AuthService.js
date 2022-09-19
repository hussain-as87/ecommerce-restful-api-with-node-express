import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcryptjs";

/**
 * @description signup user
 * @route PUT api/vi/auth/signup
 * @access public
 */
export const signup = asyncHandler(async (req, res, next) => {
  //1-create user
  const { name, email, password } = req.body;
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  // 2- generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});
/**
 * @description signup user
 * @route PUT api/vi/auth/signup
 * @access public
 */
export const login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});
