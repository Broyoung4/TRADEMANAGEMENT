// /api/inventory/[id]/route.js
import { NextResponse, NextRequest } from 'next/server';
import { connectToDB } from "../../../../utils/database"; // Adjust path
import Inventory from "../../../../models/inventory";   // Adjust path
import mongoose from 'mongoose';

// --- GET a specific inventory item by ID ---
export async function GET(request: NextRequest, context: { params: { id: string } }) {
    try {
        await connectToDB();
        const { id } = context.params;

        if (!id) {
            return NextResponse.json({ message: "Inventory item ID is required" }, { status: 400 });
        }
        if (id.length !== 24) { // Basic check for Mongoose ObjectId length
             return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
        }

        const item = await Inventory.findById(id);
        // .populate('creator'); // if needed

        if (!item) {
            return NextResponse.json({ message: "Inventory item not found" }, { status: 404 });
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error(`Error fetching inventory item with ID ${params.id}:`, error);
        if (error.name === 'CastError' && error.path === '_id') {
            return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to fetch inventory item", error: error.message }, { status: 500 });
    }
}


// --- UPDATE an existing inventory item (PUT) ---


export async function PUT(request: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;
    // Validate ID format early
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
    }

    try {
        await connectToDB();
        const body = await request.json();
        const {
            quantity, // This now represents the QUANTITY TO ADD
            itemName,
            price, // cost price per stock unit
            stockUnit,
            sellingUnit,
            conversionFactor,
            defaultSellingPricePerUnit,
            supplier,
        } = body;

        // Fetch the current item state *before* updating
        const currentItem = await Inventory.findById(id);
        if (!currentItem) {
            return NextResponse.json({ success: false, message: 'Inventory item not found for update' }, { status: 404 });
        }

        // Separate updates for $set (replace value) and $inc (increment value)
        const setUpdates = {};
        const incUpdates = {};
        let quantityToAdd = 0; // Initialize quantity to add

        // --- Validate and Prepare Updates ---

        // 1. Handle Quantity Increment ($inc)
        if (quantity !== undefined && quantity !== null && quantity !== '') {
            const numQuantityToAdd = parseFloat(quantity);
             // We only add positive quantities. Zero or negative are invalid for *adding* stock.
            if (isNaN(numQuantityToAdd)) {
                 return NextResponse.json({ success: false, message: 'Quantity to add must be a number.' }, { status: 400 });
            }
            if (numQuantityToAdd <= 0) {
                return NextResponse.json({ success: false, message: 'Quantity to add must be a positive number.' }, { status: 400 });
            }
            // Valid positive quantity to add
            incUpdates.quantity = numQuantityToAdd;
            quantityToAdd = numQuantityToAdd; // Keep track for response message potentially
        }

        // 2. Handle Other Fields for Replacement ($set)
        if (itemName !== undefined) {
            if (!itemName.trim()) return NextResponse.json({ success: false, message: 'Item Name cannot be empty.' }, { status: 400 });
             if (itemName.trim() !== currentItem.itemName) { // Only set if changed
                setUpdates.itemName = itemName.trim();
            }
        }
        if (price !== undefined) {
            const numPrice = parseFloat(price);
            if (isNaN(numPrice) || numPrice < 0) return NextResponse.json({ success: false, message: 'Cost price must be a non-negative number.' }, { status: 400 });
             if (numPrice !== currentItem.price) { // Only set if changed
                setUpdates.price = numPrice;
            }
        }
        if (stockUnit !== undefined) {
             if (!stockUnit.trim()) return NextResponse.json({ success: false, message: 'Stock Unit cannot be empty.' }, { status: 400 });
             if (stockUnit.trim() !== currentItem.stockUnit) { // Only set if changed
                setUpdates.stockUnit = stockUnit.trim();
            }
        }

        // Handle sellingUnit and conversionFactor carefully
        let finalSellingUnit = currentItem.sellingUnit;
        let finalConversionFactor = currentItem.conversionFactor;
        const effectiveStockUnit = setUpdates.stockUnit || currentItem.stockUnit; // Use potentially updated stock unit

        if (sellingUnit !== undefined) {
             finalSellingUnit = (sellingUnit?.trim() || effectiveStockUnit);
        }

        if (conversionFactor !== undefined) {
            const numConversionFactor = parseFloat(conversionFactor);
            if (isNaN(numConversionFactor) || numConversionFactor <= 0) {
                 return NextResponse.json({ success: false, message: 'Conversion factor must be a positive number if provided.' }, { status: 400 });
            }
            finalConversionFactor = numConversionFactor;
        }

        if (finalSellingUnit.toLowerCase() === effectiveStockUnit.toLowerCase()) {
             finalConversionFactor = 1;
        }

        if (finalSellingUnit !== currentItem.sellingUnit) {
             setUpdates.sellingUnit = finalSellingUnit;
        }
         if (finalConversionFactor !== currentItem.conversionFactor) {
             setUpdates.conversionFactor = finalConversionFactor;
         }


        if (defaultSellingPricePerUnit !== undefined) {
            if (defaultSellingPricePerUnit === null || defaultSellingPricePerUnit === '') {
                 if (currentItem.defaultSellingPricePerUnit !== 0 && currentItem.defaultSellingPricePerUnit !== undefined) { // Only set if changing from non-zero/non-undefined
                     setUpdates.defaultSellingPricePerUnit = 0; // Set to 0 to clear
                 }
            } else {
                const numDefaultSellingPrice = parseFloat(defaultSellingPricePerUnit);
                if (isNaN(numDefaultSellingPrice) || numDefaultSellingPrice < 0) {
                    return NextResponse.json({ success: false, message: 'Default Selling Price must be a non-negative number if provided.' }, { status: 400 });
                }
                if (numDefaultSellingPrice !== currentItem.defaultSellingPricePerUnit) {
                     setUpdates.defaultSellingPricePerUnit = numDefaultSellingPrice;
                 }
            }
        }


        if (supplier !== undefined) {
             if (supplier.trim() !== currentItem.supplier) {
                setUpdates.supplier = supplier.trim();
             }
        }

        // --- Check if any actual updates exist ---
        const hasSetUpdates = Object.keys(setUpdates).length > 0;
        const hasIncUpdates = Object.keys(incUpdates).length > 0;

        if (!hasSetUpdates && !hasIncUpdates) {
            return NextResponse.json({ success: true, message: 'No changes detected.', data: currentItem }, { status: 200 });
        }

        // --- Construct Final Update Object ---
        const finalUpdate = {};
        if (hasSetUpdates) {
            finalUpdate.$set = setUpdates;
        }
        if (hasIncUpdates) {
            finalUpdate.$inc = incUpdates;
        }

        // --- Perform the Update ---
        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            finalUpdate, // Contains $set and/or $inc
            { new: true, runValidators: true } // Options: return updated doc, run schema validators
        );

        if (!updatedItem) {
            // Re-check existence vs. validation failure
             const checkItem = await Inventory.findById(id);
             if (!checkItem) {
                  return NextResponse.json({ success: false, message: 'Inventory item not found after update attempt.' }, { status: 404 });
             }
             return NextResponse.json({ success: false, message: 'Failed to update inventory item, possible validation error.' }, { status: 500 });
        }

        let message = "Item updated successfully.";
        if (quantityToAdd > 0) {
            message = `Added ${quantityToAdd} units. ${message}`;
        }

        return NextResponse.json({ success: true, message: message, data: updatedItem }, { status: 200 });

    } catch (error) {
        console.error(`Error updating inventory item ${id}:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: "Validation Error", errors: error.errors }, { status: 400 });
        }
        if (error.name === 'CastError') {
            return NextResponse.json({ success: false, message: "Invalid data type provided.", error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: `Failed to update inventory item`, error: error.message }, { status: 500 });
    }
};

// --- DELETE an inventory item by ID ---
export const DELETE = async (request: NextRequest, context: { params: { id: string } }) => {
    const { id } = context.params;
    if (id.length !== 24) { // Basic check for Mongoose ObjectId length
        return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
    }
    try {
        await connectToDB();
        const deletedItem = await Inventory.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
        }
        // Consider implications for sales records that reference this itemId.
        return NextResponse.json({ message: 'Inventory item deleted successfully', deletedId: id }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting inventory item ${id}:`, error);
        if (error.name === 'CastError' && error.path === '_id') {
            return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
        }
        return NextResponse.json({ message: `Failed to delete inventory item`, error: error.message }, { status: 500 });
    }
};