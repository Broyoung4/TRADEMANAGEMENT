// models/inventory.js
import { model, models, Schema } from "mongoose";

const InventorySchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
    },
    itemName: {
        type: String,
        required: [true, 'Please provide a name for the item.'],
        trim: true,
        // Consider adding a unique index if item names should be unique per user or globally,
        // but your POST route currently handles updates if item name exists case-insensitively.
        // unique: true, // If names should be strictly unique
    },
    quantity: { // Quantity in stock units
        type: Number,
        required: [true, 'Please provide a quantity for the item.'],
        min: [0, 'Quantity cannot be negative.']
    },
    price: { // Cost price per stock unit
        type: Number,
        required: [true, 'Please provide a cost price for the item.'],
        min: [0, 'Cost price cannot be negative.']
    },
    stockUnit: { // e.g., bundle, pack, kg, pcs (unit for quantity & cost price)
        type: String,
        required: [true, 'Please provide a stock unit for the item (e.g., pcs, kg, bundle).'],
        trim: true,
    },
    sellingUnit: { // e.g., yard, pcs (unit for selling, can be same as stockUnit)
        type: String,
        trim: true, // Will default to stockUnit if not provided in API logic
    },
    conversionFactor: { // How many sellingUnits are in one stockUnit
        type: Number,
        default: 1,
        min: [0.00001, 'Conversion factor must be a positive number.'] // Allow very small numbers but not zero or negative
    },
    defaultSellingPricePerUnit: { // Default selling price per SELLING unit
        type: Number,
        min: [0, 'Default selling price cannot be negative.'],
        default: 0, // Or undefined if you prefer to explicitly check for its existence
    },
    supplier: {
        type: String,
        trim: true
    },
    // Deprecating 'unit' in favor of stockUnit and sellingUnit for clarity
    // You can remove this if it's no longer used, or keep if it serves another purpose.
    unit: { // Old generic unit field
        type: String,
        trim: true,
        // enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'pcs', 'box', 'pack'], // Original enum
    },
    dateAdded: { // Renamed from createdAt for consistency if you prefer, or use timestamps
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Ensure sellingUnit defaults to stockUnit if not provided
InventorySchema.pre('save', function(next) {
    if (!this.sellingUnit || this.sellingUnit.trim() === '') {
        this.sellingUnit = this.stockUnit;
    }
    if (this.sellingUnit === this.stockUnit) {
        this.conversionFactor = 1;
    }
    next();
});


const Inventory = models.Inventory || model('Inventory', InventorySchema);

export default Inventory;