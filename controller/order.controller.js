import Order from "../models/order.model.js";
import user from "../models/user.model.js";
import config from "../config/config.js";
import Stripe from "stripe";

///global variable
const currency = "USD";

const delivery_Charges = 10;

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    if (!items) {
      return res
        .status(400)
        .json({ message: "Please add items to your order." });
    }

    const order_Data = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      isPayment: false,
      date: Date.now(),
    };
    console.log("order", order_Data);
    const newOrder = new Order(order_Data);

    await newOrder.save();

    //await user.findById({_id:userId}, {$set:{cartData:{}}},{new:true});
    await user.findByIdAndUpdate(
      { _id: userId },
      { $set: { cartData: {} } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const stripeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;
    const { origin } = req.headers;

    if (!items) {
      return res
        .status(400)
        .json({ message: "Please add items to your order." });
    }
    const order_Data = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "stripe",
      isPayment: false,
      date: Date.now(),
    };

    // console.log("order",order_Data)
    const newOrder = new Order(order_Data);

    await newOrder.save();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivery_Charges * 100,
      },
      quantity: 1,
    });
    // console.log("Line Items",lineItems)
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items: lineItems,
      mode: "payment",
    });

    // console.log(session)

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyStripe = async (req, res) => {
  // const {orderId} = req.body;

  const { orderId, success } = req.body;
  const userId = req.user._id;
  //const success = false;
  console.log("verify", orderId, success);
  console.log("verify", userId);
  // console.log(typeof success);
  try {
    console.log("3");
    if (success === "true") {
      console.log("Successful");

      await Order.findByIdAndUpdate(
        { _id: orderId },
        {
          $set: { payment: true },
        }
      );
      //  console.log(order);
      console.log("1");
      await user.findByIdAndUpdate({ _id: userId }, { $set: { cartData: {} } });
      // console.log("userID", data);
      res.status(200).json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      await Order.findByIdAndDelete({ _id: orderId });
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    //const userId = '673abf0da49ee3d09a8080b2';
    console.log(
      "user-------------------------------------------------------------",
      userId
    );

    const orders = await Order.find({});
    console.log("orders: ", orders);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    //const userId = '673abf0da49ee3d09a8080b2';
    console.log(
      "user-------------------------------------------------------------",
      userId
    );

    const orders = await Order.find({ userId: userId });
    console.log("orders: ", orders);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: status } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// {placeOrder,stripeOrder,razorPayOrder,getAllOrders,getUserOrders,updateOrderStatus}
