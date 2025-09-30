import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        id: { type: String, required: true },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    amount: { type: Number, required: true },
    paymentId: String,
    orderId: String,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
