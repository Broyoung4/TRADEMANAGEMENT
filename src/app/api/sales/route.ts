import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // Import mongoose for transactions
import { connectToDB } from "../../../utils/database"; // Adjust path
import Sales from "../../../models/sales";           // Adjust path (ensure this model has itemName, unitSold, costPriceAtTimeOfSale fields)
import Inventory from "../../../models/inventory";     // Adjust path

export const GET = async (request) => {
    try {
        await connectToDB();
        // The 'populate' here is for convenience if you want to access CURRENT inventory details alongside the sale.
        // However, for historical display of itemName, unitSold, etc., your frontend should prioritize
        // the fields stored directly on the sale document itself.
        const sales = await Sales.find({})
            // .populate({ // This populate is now less critical for itemName if itemName is on Sales doc
            //     path: 'itemId',
            //     model: Inventory,
            //     select: 'itemName stockUnit sellingUnit' // Select only if truly needed for other purposes
            // })
            .sort({ saleDate: -1 });

        return NextResponse.json(sales, { status: 200 });
    } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json({ message: 'Failed to fetch sales', error: error.message }, { status: 500 });
    }
};

export const POST = async (request) => {
    await connectToDB(); // Ensure DB connection is established

    const session = await mongoose.startSession(); // Start a session for transaction
    session.startTransaction();

    try {
        const body = await request.json();
        const {
            itemId,
            quantitySold, // In selling units, sent from frontend
            sellingPrice, // Per selling unit, sent from frontend
            profit,       // Calculated on frontend
            unitSold,     // The selling unit string, sent from frontend
            costPriceAtTimeOfSale // Cost per selling unit, calculated on frontend
        } = body;

        // --- Basic Validation ---
        if (
            !itemId ||
            quantitySold === undefined ||
            sellingPrice === undefined ||
            profit === undefined || // Profit can be 0 or even negative
            !unitSold ||
            costPriceAtTimeOfSale === undefined
        ) {
            await session.abortTransaction();
            // session.endSession(); // endSession should be in a finally block ideally
            return NextResponse.json({ message: 'Missing required fields for sale record.' }, { status: 400 });
        }
        if (typeof quantitySold !== 'number' || quantitySold <= 0) {
            await session.abortTransaction();
            // session.endSession();
            return NextResponse.json({ message: 'Quantity sold must be a positive number.' }, { status: 400 });
        }
        if (typeof sellingPrice !== 'number' || sellingPrice < 0) {
             await session.abortTransaction();
             // session.endSession();
            return NextResponse.json({ message: 'Selling price must be a non-negative number.' }, { status: 400 });
        }
        // --- End Basic Validation ---

        const inventoryItem = await Inventory.findById(itemId).session(session); // Find within the transaction session
        if (!inventoryItem) {
            await session.abortTransaction();
            // session.endSession();
            return NextResponse.json({ message: 'Inventory item not found.', itemId }, { status: 404 });
        }

        // --- Inventory Update Logic (crucial) ---
        const conversionFactor = Number(inventoryItem.conversionFactor) || 1;
        const quantitySoldInStockUnits = quantitySold / conversionFactor;
        const tolerance = 0.00001; // For floating point comparisons

        // Check if stock is sufficient
        if (inventoryItem.quantity < quantitySoldInStockUnits - tolerance) {
            await session.abortTransaction();
            // session.endSession();
            return NextResponse.json({
                message: `Not enough stock for ${inventoryItem.itemName}. Available (stock units): ${inventoryItem.quantity.toFixed(3)}, Required (stock units): ${quantitySoldInStockUnits.toFixed(3)}`,
                availableStockUnits: inventoryItem.quantity,
                requiredStockUnits: quantitySoldInStockUnits
            }, { status: 400 });
        }

        inventoryItem.quantity -= quantitySoldInStockUnits;
        // Ensure quantity doesn't go negative due to tiny floating point issues if it was extremely close
        if (inventoryItem.quantity < 0) {
            inventoryItem.quantity = 0;
        }
        await inventoryItem.save({ session }); // Save inventory changes within the session
        // --- End of Inventory Update Logic ---

        // Create the new sale record
        const newSale = new Sales({ // Use 'new Sales' then 'newSale.save()' for transaction context
            itemId,
            itemName: inventoryItem.itemName, // Store the item name AT THE TIME OF SALE
            quantitySold,
            sellingPrice,
            profit,
            saleDate: new Date(), // Server sets the date
            unitSold,
            costPriceAtTimeOfSale,
        });
        await newSale.save({ session }); // Save sale record within the session

        await session.commitTransaction(); // Commit the transaction if all operations succeed

        // Return the newly created sale document (now including the persisted historical itemName)
        return NextResponse.json(newSale.toObject(), { status: 201 });

    } catch (error) {
        // If any error occurs, abort the transaction
        if (session.inTransaction()) { // Check if a transaction is active before attempting to abort
            await session.abortTransaction();
        }
        console.error('Error recording sale:', error);
        if (error.name === 'ValidationError') { // Mongoose validation error
            return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to record sale', error: error.message }, { status: 500 });
    } finally {
        // Always end the session in a finally block to prevent leaks
        if (session) { // ensure session was initialized
            session.endSession();
        }
    }
};

// (Make sure your DELETE handler for sales also uses transactions if it modifies inventory)
// For example: /api/sales/[id]/route.js
// export const DELETE = async (request, { params }) => { ... }