import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "brand is required!"],
            unique: [true, "brand must be unique!"],
            minlength: [3, "too short brand name!"],
            maxlength: [33, "too long brand name!"],
        },
        slug: {type: String, lowercase: true},
        image: String,
    },
    {timestamps: true}
);
const setImageUrl = (doc) => {
    // return base url + image name
    if (doc.image && !doc.image.includes(process.env.BASE_URL)) {
        doc.image = `${process.env.BASE_URL}/uploads/brands/${doc.image}`;
      }
};
//when get all,get one,update
brandSchema.post("init", (doc) => {
    setImageUrl(doc);
});
//when create
brandSchema.post("save", (doc) => {
    setImageUrl(doc);
});
export const Brand = mongoose.model("Brand", brandSchema);
