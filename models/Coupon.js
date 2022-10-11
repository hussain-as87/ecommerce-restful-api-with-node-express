import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name required"],
      unique: true,
    },
    expire: { type: Date, required: [true, "coupon expire time required"] },
    discount: {
      type: Number,
      required: [true, "coupon discount required"],
    },
  },
  { timeseries: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
