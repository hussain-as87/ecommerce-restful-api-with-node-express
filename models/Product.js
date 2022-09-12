import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "title is required !"],
      minlength: [3, "too short product title !"],
      maxlength: [100, "too long product title !"],
    },
    slug: { type: String, lowercase: true },
    description: {
      type: String,
      required: [true, "description is required !"],
      minlength: [20, "too short product description !"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required !"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is requried !"],
      trim: true,
      max: [10000, "price is too long !"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    colors: [String],
    imageCover: { type: String, required: "image Cover is requried !" },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belongs to category !"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 1.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});
export const Product = mongoose.model("Product", productSchema);
