import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "subcategory is required !"],
            unique: [true, "subcategory must be unique !"],
            minlength: [2, "too short subcategory name !"],
            maxlength: [32, "too long subcategory name !"],
        },
        slug: {type: String, lowercase: true},
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Subcategory must be belongs to parent category"]
        }
    },
    {timestamps: true}
);
SubCategorySchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "name -_id",
    });
    next();
});
export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
