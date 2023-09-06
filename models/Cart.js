import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                color: String,
                price: Number,
            },
        ],
        totalCartPrice: Number,
        totalPriceAfterDiscount: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
);
cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "cartItems.product",
        select: "title _id imageCover brand category description",
    });
    next();
});

export const Cart = mongoose.model("Cart", cartSchema);
