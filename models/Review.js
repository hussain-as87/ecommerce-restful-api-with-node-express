import mongoose from "mongoose";
import {Product} from "./Product.js"


const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Min ratings value is 1.0'],
            max: [5, 'Max ratings value is 5.0'],
            required: [true, 'review ratings required'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user'],
        },
        // parent reference (one to many)
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to product'],
        },
    },
    {timestamps: true}
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({path: 'user', select: 'name'});
    next();
});
//aggregation like qroup by
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
    productId
) {
    const result = await this.aggregate([
        // Stage 1 : get all reviews in specific product
        {
            $match: {product: productId},
        },
        // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
        {
            $group: {
                _id: 'product',
                avgRatings: {$avg: '$ratings'},
                ratingsQuantity: {$sum: 0},
            },
        },
    ]);

    // console.log(result);
    //update rating in product
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingQuantity: result[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('remove', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

export const Review = mongoose.model('Review', reviewSchema);