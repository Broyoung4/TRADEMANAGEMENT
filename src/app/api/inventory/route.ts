// /api/inventory/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from "../../../utils/database";
import Inventory from "../../../models/inventory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust this path

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    try {
        await connectToDB();
        const inventories = await Inventory.find({ userId: loggedInUserId }) // Filter by userId
            .sort({ updatedAt: -1 });

        return NextResponse.json(inventories, { status: 200 });
    } catch (error) {
        console.error('Error fetching user inventories:', error);
        return NextResponse.json({ message: 'Failed to fetch user inventories', error: error.message }, { status: 500 });
    }
};

export const POST = async (request) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    try {
        await connectToDB();
        const body = await request.json();
        const {
            itemName, quantity, price, stockUnit, sellingUnit,
            conversionFactor, defaultSellingPricePerUnit, supplier,
        } = body;

        console.log('[API INVENTORY POST] User:', loggedInUserId, 'Received request body:', body);

        // --- Basic Validations (mostly unchanged) ---
        if (!itemName || !itemName.trim() || quantity === undefined || price === undefined || !stockUnit || !stockUnit.trim()) {
            return NextResponse.json({ message: 'Item Name, Quantity, Cost Price, and Stock Unit are required.' }, { status: 400 });
        }
        const numQuantity = parseFloat(quantity);
        if (isNaN(numQuantity) || numQuantity < 0) {
            return NextResponse.json({ message: 'Quantity to add must be a non-negative number.' }, { status: 400 });
        }
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return NextResponse.json({ message: 'Cost price must be a non-negative number.' }, { status: 400 });
        }
        let numConversionFactor = parseFloat(conversionFactor);
        if (isNaN(numConversionFactor) || numConversionFactor <= 0) numConversionFactor = 1;
        const finalSellingUnit = (sellingUnit?.trim() || stockUnit.trim());
        const finalConversionFactor = (finalSellingUnit.toLowerCase() === stockUnit.trim().toLowerCase()) ? 1 : numConversionFactor;
        let numDefaultSellingPrice;
        if (defaultSellingPricePerUnit !== undefined && defaultSellingPricePerUnit !== null && defaultSellingPricePerUnit !== '') {
            numDefaultSellingPrice = parseFloat(defaultSellingPricePerUnit);
            if (isNaN(numDefaultSellingPrice) || numDefaultSellingPrice < 0) {
                return NextResponse.json({ message: 'Default Selling Price must be a non-negative number if provided.' }, { status: 400 });
            }
        }
        // --- End Validations ---

        const searchItemName = itemName.trim();
        const searchStockUnit = stockUnit.trim();
        console.log(`[API INVENTORY POST] User: ${loggedInUserId}, Attempting to find existing item with Name: "${searchItemName}", Unit: "${searchStockUnit}"`);

        const existingItem = await Inventory.findOne({
            itemName: searchItemName.toLowerCase(),
            stockUnit: searchStockUnit.toLowerCase(),
            userId: loggedInUserId // Crucial: Search within the current user's inventory
        }).collation({ locale: 'en', strength: 2 });

        if (existingItem) {
            console.log(`[API INVENTORY POST] User: ${loggedInUserId}, FOUND existing item. ID: ${existingItem._id}. Updating...`);
            const oldQuantity = Number(existingItem.quantity) || 0;
            const oldCostPrice = Number(existingItem.price) || 0;
            const addedQuantity = numQuantity;
            const newBatchCostPrice = numPrice;
            const newTotalQuantity = oldQuantity + addedQuantity;
            let newWeightedAveragePrice;
            if (newTotalQuantity > 0) {
                const oldValue = oldQuantity * oldCostPrice;
                const addedValue = addedQuantity * newBatchCostPrice;
                newWeightedAveragePrice = (oldValue + addedValue) / newTotalQuantity;
            } else {
                newWeightedAveragePrice = newBatchCostPrice;
            }
            existingItem.quantity = newTotalQuantity;
            existingItem.price = newWeightedAveragePrice;
            existingItem.stockUnit = stockUnit.trim(); // Keep original casing from user input
            existingItem.sellingUnit = finalSellingUnit;
            existingItem.conversionFactor = finalConversionFactor;
            if (numDefaultSellingPrice !== undefined) existingItem.defaultSellingPricePerUnit = numDefaultSellingPrice;
            if (supplier) existingItem.supplier = supplier.trim();
            // userId remains the same

            await existingItem.save();
            console.log(`[API INVENTORY POST] User: ${loggedInUserId}, SUCCESS updated item "${existingItem.itemName}".`);
            return NextResponse.json(existingItem, { status: 200 });
        } else {
            console.log(`[API INVENTORY POST] User: ${loggedInUserId}, DID NOT FIND existing item. Creating new item.`);
            const newItemData = {
                itemName: searchItemName,
                quantity: numQuantity,
                price: numPrice,
                stockUnit: stockUnit.trim(),
                sellingUnit: finalSellingUnit,
                conversionFactor: finalConversionFactor,
                userId: loggedInUserId, // Assign current user's ID
            };
            if (supplier) newItemData.supplier = supplier.trim();
            if (numDefaultSellingPrice !== undefined) newItemData.defaultSellingPricePerUnit = numDefaultSellingPrice;

            const newItem = await Inventory.create(newItemData);
            console.log(`[API INVENTORY POST] User: ${loggedInUserId}, SUCCESS created new item "${newItem.itemName}".`);
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