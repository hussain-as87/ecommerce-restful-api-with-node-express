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
    image: String,
  },
  { timestamps: true }
);
const setImageUrl = (doc) => {
  // return base url + image name
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/uploads/categories/${doc.image}`;
  }
};
//when get all,get one,update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
//when create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
export const Category = mongoose.model("Category", categorySchema);
