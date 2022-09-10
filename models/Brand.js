import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand is required !"],
      unique: [true, "brand must be unique !"],
      minlength: [3, "too short brand name !"],
      maxlength: [33, "too long brand name !"],
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  { timestamps: true }
);
export const Brand = mongoose.model("Brand", brandSchema);
