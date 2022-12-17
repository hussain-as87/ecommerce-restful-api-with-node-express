import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import { indexFactory, showFactory } from "./handlersFactory.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

export const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
/**
 * @description Get list of orders
 * @route GET api/vi/orders
 * @access private (user)
 */
export const index = indexFactory(Order);
/**
 * @description Show specific order by id
 * @route GET api/vi/orders/:id
 * @access public
 */
export const show = showFactory(Order);

/**
 * @description Create new order
 * @route POST api/vi/orders
 * @access private
 */
export const create = asyncHandler(async (req, res, next) => {
  //app setting
  const taxPrice = 0,
    shippingPrice = 0;
  // 1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no such cart id ${req.params.cartId}`, 404)
    );
  }
  // 2) get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) after creating order, decrement product quantity, incrememt prodcut sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5) clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    status: "success",
    data: order,
  });
});

/**
 * @description Update order paid status to true
 * @route PUT api/vi/orders/:id/pay
 * @access protected(Admin-Manager)
 */
export const updateOrderPaidStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ApiError(`there is no order with such id ${id}`, 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});
/**
 * @description Update order delivered status to true
 * @route PUT api/vi/orders/:id/deliver
 * @access protected(Admin-Manager)
 */
export const updateOrderDeliveredStatus = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return next(new ApiError(`there is no order with such id ${id}`, 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: "success", data: updatedOrder });
  }
);
/**
 * @description get checkout session from strip and send as response
 * @route GET api/vi/orders/checkout-session/:cartId
 * @access protected(Admin-Manager)
 */
export const checkoutSession = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    /*  line_items: [
      {
        name: req.user.name,
        unit_amount: totalOrderPrice * 100,
        currency: 'ils',
        quantity: 1,
      },
    ], */
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});

/**
 * @description webhookCheckout
 * @route POST api/vi/webhookCheckout
 * @access protected(User)
 */
export const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.display_items[0].amount / 100;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress: shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  //after creating order, decrement product quantity, incrememt prodcut sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    //clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};
/**
 * @description webhookCheckout
 * @route POST api/vi/webhookCheckout
 * @access protected(User)
 */
export const webhookCheckout = asyncHandler(async (err, req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  event = await stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET_KEY
  );
  if (!event) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return new ApiError(`Webhook Error: ${err.message}`, 400);
  } else if (event.type == "checkout.session.completed") {
    //create order
    createCardOrder(event.data.object);
    // Successfully constructed event
    console.log("✅ Success:", event.id);
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
});
