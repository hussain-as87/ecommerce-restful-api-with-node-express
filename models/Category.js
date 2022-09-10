import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required !"],
      unique: [true, "category must be unique !"],
      minlength: [3, "too short category name !"],
      maxlength: [33, "too long category name !"],
    },
    slug: { type: String, lowercase: true },
    image:String
  },
  { timestamps: true }
);
export const Category = mongoose.model("Category", categorySchema);
