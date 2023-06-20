import crypto from "crypto";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

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
 * @description login user
 * @route PUT api/vi/auth/login
 * @access public
 */
export const login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
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

/**
 * @description protect token
 */
export const protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  /*   if (currentUser.active == false) {
        return next(new ApiError("your account not active !", 401));
      } */

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

/**
 * @description  Authorization (User Permissions)
 * @access ["admin", "manager"]
 */
export const permissions = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

  
  /**
   * @description  Forgot password
   * @route   POST /api/v1/auth/forgotPassword
   * @access  Public
   */
  export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
  
    // Get user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(`There is no user with that email: ${email}`, 404));
    }
  
    // Generate a random 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Hash the reset code
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    // Save hashed password reset code and its expiration time into the database
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.passwordResetVerified = false;
    await user.save();
  
    // Send the reset code via email
    const message = `Hi ${user.name},\n\nWe received a request to reset the password on your E-shop Account.\n\nReset Code: ${resetCode}\n\nEnter this code to complete the reset.\n\nThanks for helping us keep your account secure.\nThe E-shop Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      return next(new ApiError('There was an error sending the email. Please try again later.', 500));
    }
  
    res.status(200).json({ status: 'success', message: 'Reset code sent to email' });
  });
  
  /**
   * @description  Verify password reset code
   * @route   POST /api/v1/auth/verifyPasswordResetCode
   * @access  Public
   */
  export const verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
    const { resetCode } = req.body;
  
    // Hash the reset code
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    // Get user based on the hashed reset code and valid expiration time
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ApiError('Invalid or expired reset code', 400));
    }
  
    // Reset code is valid, mark it as verified
    user.passwordResetVerified = true;
    await user.save();
  
    res.status(200).json({ status: 'success' });
  });
  

/**
 * @description  reset password
 * @route   POST /api/v1/auth/resetPasword
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }
  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  //3)if everything is ok, generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(200).json({ token });
});
