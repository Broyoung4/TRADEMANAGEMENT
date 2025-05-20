// models/inventory.js
import { model, models, Schema } from "mongoose";

const InventorySchema = new Schema({
    userId: { // <--- RENAMED FROM 'creator'
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for inventory item.'] // Added required validation
    },
    itemName: {
        type: String,
        required: [true, 'Please provide a name for the item.'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide a quantity for the item.'],
        min: [0, 'Quantity cannot be negative.']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a cost price for the item.'],
        min: [0, 'Cost price cannot be negative.']
    },
    stockUnit: {
        type: String,
        required: [true, 'Please provide a stock unit for the item (e.g., pcs, kg, bundle).'],
        trim: true,
    },
    sellingUnit: {
        type: String,
        trim: true,
    },
    conversionFactor: {
        type: Number,
        default: 1,
        min: [0.00001, 'Conversion factor must be a positive number.']
    },
    defaultSellingPricePerUnit: {
        type: Number,
        min: [0, 'Default selling price cannot be negative.'],
        default: 0,
    },
    supplier: {
        type: String,
        trim: true
    },
    unit: { // Consider removing if fully deprecated and data migrated
        type: String,
        trim: true,
    },
    // dateAdded is handled by timestamps: true
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

InventorySchema.pre('save', function(next) {
    if (!this.sellingUnit || this.sellingUnit.trim() === '') {
        this.sellingUnit = this.stockUnit;
    }
    if (this.isModified('stockUnit') || this.isModified('sellingUnit')) { // Re-evaluate if stockUnit or sellingUnit changes
        if (this.sellingUnit.toLowerCase() === this.stockUnit.toLowerCase()) {
            this.conversionFactor = 1;
        }
    }
    next();
});

const Inventory = models.Inventory || model('Inventory', InventorySchema);
export default Inventory;