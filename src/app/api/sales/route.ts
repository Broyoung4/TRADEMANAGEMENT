// /api/sales/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from "../../../utils/database";
import Sales from "../../../models/sales";
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
        const sales = await Sales.find({ userId: loggedInUserId }) // Filter by userId
            .sort({ saleDate: -1 });
        return NextResponse.json(sales, { status: 200 });
    } catch (error) {
        console.error('Error fetching user sales:', error);
        return NextResponse.json({ message: 'Failed to fetch user sales', error: error.message }, { status: 500 });
    }
};

export const POST = async (request) => {
    const authSession = await getServerSession(authOptions); // Renamed to avoid conflict with mongoose session
    if (!authSession || !authSession.user || !authSession.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = authSession.user.id;

    await connectToDB();
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();

    try {
        const body = await request.json();
        const {
            itemId, quantitySold, sellingPrice, profit,
            unitSold, costPriceAtTimeOfSale
        } = body;

        // --- Basic Validation ---
        if (!itemId || quantitySold === undefined || sellingPrice === undefined || profit === undefined || !unitSold || costPriceAtTimeOfSale === undefined) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: 'Missing required fields for sale record.' }, { status: 400 });
        }
        if (typeof quantitySold !== 'number' || quantitySold <= 0) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: 'Quantity sold must be a positive number.' }, { status: 400 });
        }
        if (typeof sellingPrice !== 'number' || sellingPrice < 0) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: 'Selling price must be a non-negative number.' }, { status: 400 });
        }
        // --- End Basic Validation ---

        const inventoryItem = await Inventory.findById(itemId).session(mongooseSession);
        if (!inventoryItem) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: 'Inventory item not found.', itemId }, { status: 404 });
        }

        // Authorization: Check if the inventory item belongs to the logged-in user
        if (inventoryItem.userId.toString() !== loggedInUserId) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: "Forbidden: You cannot sell an inventory item you do not own." }, { status: 403 });
        }

        const conversionFactor = Number(inventoryItem.conversionFactor) || 1;
        const quantitySoldInStockUnits = quantitySold / conversionFactor;
        const tolerance = 0.00001;

        if (inventoryItem.quantity < quantitySoldInStockUnits - tolerance) {
            await mongooseSession.abortTransaction();
            return NextResponse.json({ message: `Not enough stock for ${inventoryItem.itemName}.` }, { status: 400 });
        }

        inventoryItem.quantity -= quantitySoldInStockUnits;
        if (inventoryItem.quantity < 0) inventoryItem.quantity = 0;
        await inventoryItem.save({ session: mongooseSession });

        const newSale = new Sales({
            itemId,
            itemName: inventoryItem.itemName,
            quantitySold,
            sellingPrice,
            profit,
            saleDate: new Date(),
            unitSold,
            costPriceAtTimeOfSale,
            userId: loggedInUserId, // Assign current user's ID to the sale
        });
        await newSale.save({ session: mongooseSession });

        await mongooseSession.commitTransaction();
        return NextResponse.json(newSale.toObject(), { status: 201 });

    } catch (error) {
        if (mongooseSession.inTransaction()) {
            await mongooseSession.abortTransaction();
        }
        console.error('Error recording sale:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: "Validation Error", errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Failed to record sale', error: error.message }, { status: 500 });
    } finally {
        if (mongooseSession) {
            mongooseSession.endSession();
        }
    }
};