// app/models/sales.js
import { Schema, model, models } from "mongoose";

const SalesSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    itemName: {
      type: String,
      required: true,
    },
    quantitySold: { type: Number, required: true }, // Quantity in sellingUnits
    sellingPrice: { type: Number, required: true }, // Price per sellingUnit
    profit: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    unitSold: { type: String, required: [true, "Unit sold is required."] }, // The selling unit at the time of sale
    costPriceAtTimeOfSale: {
      type: Number,
      required: [true, "Cost price at time of sale is required."],
    }, // Cost per sellingUnit
    // creator: { type: Schema.Types.ObjectId, ref: 'User' }, // If you have user association
  },
  { timestamps: true }
);

const Sales = models.Sales || model("Sales", SalesSchema);
export default Sales;
