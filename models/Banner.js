import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
            unique: [true, "Title must be unique!"],
            minlength: [3, "Too short banner title!"],
            maxlength: [33, "Too long banner title!"],
        },
        subtitle: {
            type: String,
            required: [true, "Subtitle is required!"],
            unique: [true, "Subtitle must be unique!"],
            minlength: [3, "Too short banner subtitle!"],
            maxlength: [33, "Too long banner subtitle!"],
        },
        slug: {type: String, lowercase: true},
        summary: {
            type: String,
            required: [true, 'Summary is require!']
        },
        description: {
            type: String,
            required: [true, 'Description is require!']
        },
        image: String,
    },
    {timestamps: true}
);
const setImageUrl = (doc) => {
    // return base url + image name
    if (doc.image && !doc.image.includes(process.env.BASE_URL)) {
        doc.image = `${process.env.BASE_URL}/uploads/banners/${doc.image}`;
    }
};
//when get all,get one,update
bannerSchema.post("init", (doc) => {
    setImageUrl(doc);
});
//when create
bannerSchema.post("save", (doc) => {
    setImageUrl(doc);
});
export const Banner = mongoose.model("Banner", bannerSchema);
