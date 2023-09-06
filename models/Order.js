import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Order must be belong to user"],
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
                color: String,
                price: Number,
            },
        ],

        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingAddress: {
            firstName:String,
            lastName:String,
            email:String,
            details: String,
            phone: String,
            country: String,
            city: String,
            postalCode: String,
            notes: String,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: {
            type: Number,
        },
        paymentMethodType: {
            type: String,
            enum: ["card", "cash"],
            default: "cash",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    {timestamps: true}
);

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name profileImg email phone",
    }).populate({
        path: "cartItems.product",
        select: "title imageCover ratingQuantity ratingsAverage",
    });

    next();
});

export const Order = mongoose.model("Order", orderSchema);
