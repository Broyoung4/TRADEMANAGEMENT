// /api/inventory/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from "../../../utils/database"; // Adjust path as necessary
import Inventory from "../../../models/inventory";    // Adjust path as necessary

export const GET = async () => {
    try {
        await connectToDB();
        const inventories = await Inventory.find({})
            // .populate('creator') // Uncomment if needed
            .sort({ updatedAt: -1 }); // Sort by last update

        return NextResponse.json(inventories, { status: 200 });
    } catch (error) {
        console.error('Error fetching inventories:', error);
        return NextResponse.json({ message: 'Failed to fetch all inventories', error: error.message }, { status: 500 });
    }
};


export const POST = async (request) => {
    try {
        await connectToDB();
        const body = await request.json();
        const {
            itemName,
            quantity,
            price,
            stockUnit,
            sellingUnit,
            conversionFactor,
            defaultSellingPricePerUnit,
            supplier,
            // creator
        } = body;

        console.log('[API INVENTORY POST] Received request body:', body); // Log incoming data

        // --- Basic Validations (mostly unchanged) ---
        if (!itemName || !itemName.trim() || quantity === undefined || price === undefined || !stockUnit || !stockUnit.trim()) {
            console.error('[API INVENTORY POST] Validation Error: Missing required fields.');
            return NextResponse.json({ message: 'Item Name, Quantity, Cost Price, and Stock Unit are required.' }, { status: 400 });
        }
        const numQuantity = parseFloat(quantity);
        if (isNaN(numQuantity) || numQuantity < 0) {
             console.error('[API INVENTORY POST] Validation Error: Invalid quantity.');
            return NextResponse.json({ message: 'Quantity to add must be a non-negative number.' }, { status: 400 });
        }
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) {
             console.error('[API INVENTORY POST] Validation Error: Invalid cost price.');
            return NextResponse.json({ message: 'Cost price must be a non-negative number.' }, { status: 400 });
        }
        // ... (rest of validation for conversionFactor, sellingUnit, defaultSellingPrice - unchanged) ...
        let numConversionFactor = parseFloat(conversionFactor);
        if (isNaN(numConversionFactor) || numConversionFactor <= 0) {
            numConversionFactor = 1;
        }
        const finalSellingUnit = (sellingUnit?.trim() || stockUnit.trim());
        const finalConversionFactor = (finalSellingUnit.toLowerCase() === stockUnit.trim().toLowerCase()) ? 1 : numConversionFactor;
        let numDefaultSellingPrice;
        if (defaultSellingPricePerUnit !== undefined && defaultSellingPricePerUnit !== null && defaultSellingPricePerUnit !== '') {
            numDefaultSellingPrice = parseFloat(defaultSellingPricePerUnit);
            if (isNaN(numDefaultSellingPrice) || numDefaultSellingPrice < 0) {
                 console.error('[API INVENTORY POST] Validation Error: Invalid default selling price.');
                return NextResponse.json({ message: 'Default Selling Price must be a non-negative number if provided.' }, { status: 400 });
            }
        }
        // --- End Validations ---


        const searchItemName = itemName.trim(); // Use a variable for logging consistency
        const searchStockUnit = stockUnit.trim();
        console.log(`[API INVENTORY POST] Attempting to find existing item with Name: "${searchItemName}" (Case-Insensitive)`);

        // Case-insensitive search for existing item (using trimmed name)
       /*  const existingItem = await Inventory.findOne({
            itemName: { $regex: `^${searchItemName}$`, $options: 'i' }
            // If needed later, add more criteria like:
            // stockUnit: { $regex: `^${stockUnit.trim()}$`, $options: 'i' },
            // creator: creatorId,
        }); */

        const existingItem = await Inventory.findOne({
            itemName: searchItemName.toLowerCase(),
            stockUnit: searchStockUnit.toLowerCase()
        }).collation({ locale: 'en', strength: 2 }); // Ensure case-insensitive collation

        if (existingItem) {
            // === Item exists - UPDATE ===
            console.log(`[API INVENTORY POST] FOUND existing item. ID: ${existingItem._id}. Name in DB: "${existingItem.itemName}". Updating...`);

            // Store old values for weighted average calculation
            const oldQuantity = Number(existingItem.quantity) || 0;
            const oldCostPrice = Number(existingItem.price) || 0;
            const addedQuantity = numQuantity;
            const newBatchCostPrice = numPrice;

            // Calculate new total quantity
            const newTotalQuantity = oldQuantity + addedQuantity;

            // Calculate new weighted average cost price
            let newWeightedAveragePrice;
            if (newTotalQuantity > 0) {
                const oldValue = oldQuantity * oldCostPrice;
                const addedValue = addedQuantity * newBatchCostPrice;
                newWeightedAveragePrice = (oldValue + addedValue) / newTotalQuantity;
            } else {
                newWeightedAveragePrice = newBatchCostPrice; // Or 0
            }

            // Update item properties
            existingItem.quantity = newTotalQuantity;
            existingItem.price = newWeightedAveragePrice;

            // Update other details (overwrites with new batch details - review if this is desired)
            existingItem.stockUnit = stockUnit.trim();
            existingItem.sellingUnit = finalSellingUnit;
            existingItem.conversionFactor = finalConversionFactor;
            if (numDefaultSellingPrice !== undefined) {
                existingItem.defaultSellingPricePerUnit = numDefaultSellingPrice;
            }
             if (supplier) existingItem.supplier = supplier.trim();
             // existingItem.creator = creatorId; // if applicable

            await existingItem.save();
            console.log(`[API INVENTORY POST] SUCCESS updated item "${existingItem.itemName}". New Qty: ${existingItem.quantity}, New Avg Cost: ${existingItem.price.toFixed(2)}`);
            return NextResponse.json(existingItem, { status: 200 });

        } else {
            // === Item doesn't exist - CREATE ===
            console.log(`[API INVENTORY POST] DID NOT FIND existing item with Name: "${searchItemName}". Creating new item.`);
            const newItemData = {
                itemName: searchItemName, // Use the trimmed name
                quantity: numQuantity,
                price: numPrice,
                stockUnit: stockUnit.trim(),
                sellingUnit: finalSellingUnit,
                conversionFactor: finalConversionFactor,
                // supplier: supplier ? supplier.trim() : undefined,
                // creator: creatorId,
            };
            if (supplier) newItemData.supplier = supplier.trim();
            if (numDefaultSellingPrice !== undefined) {
                newItemData.defaultSellingPricePerUnit = numDefaultSellingPrice;
            }

            const newItem = await Inventory.create(newItemData);
            console.log(`[API INVENTORY POST] SUCCESS created new item "${newItem.itemName}". Qty: ${newItem.quantity}, Cost: ${newItem.price.toFixed(2)}`);
            return NextResponse.json(newItem, { status: 201 });
        }

    } catch (error) {
        console.error('[API INVENTORY POST] Error processing inventory item:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to process inventory item', error: error.message }, { status: 500 });
    }
};

