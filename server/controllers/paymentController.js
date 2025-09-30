import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import Product from "../models/Product.js"; 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    let { amount, currency = "INR", products, userId } = req.body;

    // ✅ Ensure amount is in paise and integer
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount received" });
    }

    amount = Math.round(amount); // convert to integer paise

    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        items: JSON.stringify(products),
      },
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("🔴 Error creating Razorpay order:", err);
    res.status(500).json({ error: err.message });
  }
};


// Verify payment + Save order
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      products,
      amount,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Save order in DB
      const newOrder = new Order({
        userId,
        products,
        amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: "Paid",
      });
      await newOrder.save();

      // ✅ Decrease stock for each product
      for (const item of products) {
        const product = await Product.findById(item._id);

        if (!product) {
          console.error("❌ Product not found:", item._id);
          continue;
        }

        if (product.stock < item.quantity) {
          console.error("⚠️ Not enough stock for:", product.name);
          return res.status(400).json({ success: false, message: `${product.name} out of stock` });
        }

        product.stock -= item.quantity;
        await product.save();

      }

      return res.json({ success: true, order: newOrder });
    } else {
      return res.json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    res.status(500).json({ error: err.message });
  }
};
