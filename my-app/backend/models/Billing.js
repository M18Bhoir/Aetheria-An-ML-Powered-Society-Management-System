import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  amountPaid: Number,
  paymentDate: Date,
});

export default mongoose.model("Billing", billingSchema);
