// app/models/sales.js
import { Schema, model, models } from "mongoose";

const SalesSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    itemName: {
      type: String,
      required: true,
    },
    quantitySold: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    profit: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    unitSold: { type: String, required: [true, "Unit sold is required."] },
    costPriceAtTimeOfSale: {
      type: Number,
      required: [true, "Cost price at time of sale is required."],
    },
    userId: { // <--- ADD THIS FIELD (uncommented and named userId)
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for sale record.'] // Added required validation
    },
  },
  { timestamps: true }
);

const Sales = models.Sales || model("Sales", SalesSchema);
export default Sales;