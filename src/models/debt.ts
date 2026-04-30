// models/debt.ts
import { Schema, model, models } from "mongoose";

const DebtSchema = new Schema(
  {
    saleId: {
      type: Schema.Types.ObjectId,
      ref: "Sales",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for debt record."],
    },
    itemName: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative."],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative."],
    },
    amountOwed: {
      type: Number,
      required: true,
      min: [0, "Amount owed cannot be negative."],
    },
    debtStatus: {
      type: String,
      enum: ["pending", "partial", "settled"],
      default: "pending",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    lastPaymentDate: {
      type: Date,
    },
    paymentHistory: [
      {
        amountPaid: Number,
        paymentDate: { type: Date, default: Date.now },
        note: String,
      },
    ],
    originalProfit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to update amountOwed before saving
DebtSchema.pre("save", function (next) {
  this.amountOwed = this.totalAmount - this.amountPaid;

  if (this.amountOwed === 0) {
    this.debtStatus = "settled";
  } else if (this.amountPaid > 0) {
    this.debtStatus = "partial";
  } else {
    this.debtStatus = "pending";
  }

  next();
});

const Debt = models.Debt || model("Debt", DebtSchema);
export default Debt;
