import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import {uploadSingleImage} from "../middlewares/uploadImageMiddleware.js";
import {User} from "../models/User.js";
import {
    createFactory,
    destroyFactory,
    indexFactory,
    showFactory,
} from "./handlersFactory.js";
import {v4 as uuidv4} from "uuid";
import {ApiError} from "../utils/apiError.js";

/**
 * @description upload image
 */
export const uploadImage = uploadSingleImage("profileImg");

/**
 * @description upload image
 */
export const resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`public/uploads/users/${filename}`);
        //save image in Database
        req.body.profileImg = filename;
    }

    next();
});
/**
 * @description Get list of users
 * @route GET api/vi/users
 * @access private
 */
export const index = indexFactory(User);
/**
 * @description Show specific users by id
 * @route GET api/vi/users/:id
 * @access private
 */
export const show = showFactory(User);

/**
 * @description Create new user
 * @route POST api/vi/users
 * @access private
 */
export const create = createFactory(User);

/**
 * @description Update specific user by id
 * @route PUT api/vi/users/:id
 * @access private
 */
export const update = asyncHandler(async (req, res, next) => {
    const {name, slug, phone, profileImg, role} = req.body;
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: name,
            slug: slug,
            phone: phone,
            profileImg: profileImg,
            role: role,
        },
        {
            new: true,
        }
    );
    if (!document) next(new ApiError(`No ${User} with id ${id}`, 404));
    res.status(200).json({data: document});
});

/**
 * @description Update password specific user by id
 * @route PUT api/vi/users/:id
 * @access private
 */
export const changePassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});
/**
 * @description Delete specific user by id
 * @route PUT api/vi/users/:id
 * @access private
 */
export const destroy = destroyFactory(User);

/**
 * @description Get Logged user data
 * @route  GET /api/v1/users/get
 * @access  Private/Protect
 */
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

/**
 * @description   Update logged user password
 * @route  GET /api/v1/users/updateMyPassword
 * @access  Private/Protect
 */
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    // 2) Generate token
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    res.status(200).json({data: user, token});
});

/**
 * @description Update logged user data (without password, role)
 * @route  GET /api/v1/users/update
 * @access  Private/Protect
 */
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        {new: true}
    );

    res.status(200).json({data: updatedUser});
});

/**
 * @description Deactivate logged user
 * @route  DELETE /api/v1/users/delete
 * @access  Private/Protect
 */
export const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false});

    res.status(204).json({status: "Success"});
});
/**
 * @description active my account
 * @route  DELETE /api/v1/users/active
 * @access  Private/Protect
 */
export const activeLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: true});
    res.status(204).json({status: "Success"});
});
