// /api/inventory/[id]/route.js
import { NextResponse, NextRequest } from 'next/server';
import { connectToDB } from "../../../../utils/database";
import Inventory from "../../../../models/inventory";
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust this path

// --- GET a specific inventory item by ID ---
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    try {
        await connectToDB();
        const { id } = params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
        }

        const item = await Inventory.findById(id);

        if (!item) {
            return NextResponse.json({ message: "Inventory item not found" }, { status: 404 });
        }

        // Authorization: Check if the item belongs to the logged-in user
        if (item.userId.toString() !== loggedInUserId) {
            return NextResponse.json({ message: "Forbidden: You do not own this resource" }, { status: 403 });
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error(`Error fetching inventory item with ID ${params.id}:`, error);
        // CastError is already handled by mongoose.Types.ObjectId.isValid
        return NextResponse.json({ message: "Failed to fetch inventory item", error: error.message }, { status: 500 });
    }
}

// --- UPDATE an existing inventory item (PUT) ---
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
    }

    try {
        await connectToDB();
        const body = await request.json();
        const {
            quantity, itemName, price, stockUnit, sellingUnit,
            conversionFactor, defaultSellingPricePerUnit, supplier,
        } = body;

        const currentItem = await Inventory.findById(id);
        if (!currentItem) {
            return NextResponse.json({ success: false, message: 'Inventory item not found for update' }, { status: 404 });
        }

        // Authorization: Check if the item belongs to the logged-in user
        if (currentItem.userId.toString() !== loggedInUserId) {
            return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
        }

        const setUpdates = {};
        const incUpdates = {};
        let quantityToAdd = 0;

        if (quantity !== undefined && quantity !== null && quantity !== '') {
            const numQuantityToAdd = parseFloat(quantity);
            if (isNaN(numQuantityToAdd)) return NextResponse.json({ success: false, message: 'Quantity to add must be a number.' }, { status: 400 });
            if (numQuantityToAdd <= 0) return NextResponse.json({ success: false, message: 'Quantity to add must be a positive number.' }, { status: 400 });
            incUpdates.quantity = numQuantityToAdd;
            quantityToAdd = numQuantityToAdd;
        }

        if (itemName !== undefined) {
            if (!itemName.trim()) return NextResponse.json({ success: false, message: 'Item Name cannot be empty.' }, { status: 400 });
            if (itemName.trim() !== currentItem.itemName) setUpdates.itemName = itemName.trim();
        }
        if (price !== undefined) {
            const numPrice = parseFloat(price);
            if (isNaN(numPrice) || numPrice < 0) return NextResponse.json({ success: false, message: 'Cost price must be a non-negative number.' }, { status: 400 });
            if (numPrice !== currentItem.price) setUpdates.price = numPrice;
        }
        if (stockUnit !== undefined) {
            if (!stockUnit.trim()) return NextResponse.json({ success: false, message: 'Stock Unit cannot be empty.' }, { status: 400 });
            if (stockUnit.trim() !== currentItem.stockUnit) setUpdates.stockUnit = stockUnit.trim();
        }

        let finalSellingUnit = currentItem.sellingUnit;
        let finalConversionFactor = currentItem.conversionFactor;
        const effectiveStockUnit = setUpdates.stockUnit || currentItem.stockUnit;

        if (sellingUnit !== undefined) finalSellingUnit = (sellingUnit?.trim() || effectiveStockUnit);
        if (conversionFactor !== undefined) {
            const numConversionFactor = parseFloat(conversionFactor);
            if (isNaN(numConversionFactor) || numConversionFactor <= 0) return NextResponse.json({ success: false, message: 'Conversion factor must be a positive number.' }, { status: 400 });
            finalConversionFactor = numConversionFactor;
        }
        if (finalSellingUnit.toLowerCase() === effectiveStockUnit.toLowerCase()) finalConversionFactor = 1;

        if (finalSellingUnit !== currentItem.sellingUnit) setUpdates.sellingUnit = finalSellingUnit;
        if (finalConversionFactor !== currentItem.conversionFactor) setUpdates.conversionFactor = finalConversionFactor;

        if (defaultSellingPricePerUnit !== undefined) {
            if (defaultSellingPricePerUnit === null || defaultSellingPricePerUnit === '') {
                if (currentItem.defaultSellingPricePerUnit !== 0 && currentItem.defaultSellingPricePerUnit !== undefined) setUpdates.defaultSellingPricePerUnit = 0;
            } else {
                const numDefaultSellingPrice = parseFloat(defaultSellingPricePerUnit);
                if (isNaN(numDefaultSellingPrice) || numDefaultSellingPrice < 0) return NextResponse.json({ success: false, message: 'Default Selling Price non-negative.' }, { status: 400 });
                if (numDefaultSellingPrice !== currentItem.defaultSellingPricePerUnit) setUpdates.defaultSellingPricePerUnit = numDefaultSellingPrice;
            }
        }
        if (supplier !== undefined && supplier.trim() !== currentItem.supplier) setUpdates.supplier = supplier.trim();

        const hasSetUpdates = Object.keys(setUpdates).length > 0;
        const hasIncUpdates = Object.keys(incUpdates).length > 0;

        if (!hasSetUpdates && !hasIncUpdates) {
            return NextResponse.json({ success: true, message: 'No changes detected.', data: currentItem }, { status: 200 });
        }

        const finalUpdate = {};
        if (hasSetUpdates) finalUpdate.$set = setUpdates;
        if (hasIncUpdates) finalUpdate.$inc = incUpdates;
        // Note: userId is NOT changed here, it's fixed by ownership.

        const updatedItem = await Inventory.findByIdAndUpdate(id, finalUpdate, { new: true, runValidators: true });

        if (!updatedItem) { // Should not happen if currentItem was found and validators pass
             return NextResponse.json({ success: false, message: 'Failed to update inventory item, item may no longer exist or validation failed.' }, { status: 500 });
        }
        let message = "Item details updated successfully.";
        if (quantityToAdd > 0) message = `Added ${quantityToAdd} units. ${message}`;
        return NextResponse.json({ success: true, message: message, data: updatedItem }, { status: 200 });

    } catch (error) {
        console.error(`Error updating inventory item ${id}:`, error);
        if (error.name === 'ValidationError') return NextResponse.json({ success: false, message: "Validation Error", errors: error.errors }, { status: 400 });
        if (error.name === 'CastError') return NextResponse.json({ success: false, message: "Invalid data type provided.", error: error.message }, { status: 400 });
        return NextResponse.json({ success: false, message: `Failed to update inventory item`, error: error.message }, { status: 500 });
    }
};

// --- DELETE an inventory item by ID ---
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid inventory item ID format" }, { status: 400 });
    }

    try {
        await connectToDB();
        const itemToDelete = await Inventory.findById(id);

        if (!itemToDelete) {
            return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
        }

        // Authorization: Check if the item belongs to the logged-in user
        if (itemToDelete.userId.toString() !== loggedInUserId) {
            return NextResponse.json({ message: "Forbidden: You do not own this resource" }, { status: 403 });
        }

        // Check for existing sales records associated with this inventory item for this user.
        // If you want to prevent deletion if sales exist, you'd query the Sales collection here.
        // For now, we'll proceed with deletion as per original logic.

        const deletedItem = await Inventory.findByIdAndDelete(id); // redundant findByIdAndDelete, already have itemToDelete
        // await itemToDelete.remove(); or await Inventory.deleteOne({ _id: id, userId: loggedInUserId }); might be more direct

        // If we use findByIdAndDelete, no need for itemToDelete.remove()
        // If we used itemToDelete.remove(), the 'deletedItem' variable here would be the result of remove.
        // Sticking to the logic: find, authorize, then delete by ID.
        // So, the findByIdAndDelete is correct, just make sure the prior find was for authorization only.
        // Simpler:
        // await Inventory.deleteOne({ _id: id, userId: loggedInUserId });
        // This atomically checks ownership and deletes. However, to return deletedItem data, findById is better.

        // Let's stick to your findByIdAndDelete, but ensure the item found was authorized.
        // The sequence above is: find, authorize, then findByIdAndDelete. This is fine.

        return NextResponse.json({ message: 'Inventory item deleted successfully', deletedId: id }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting inventory item ${id}:`, error);
        // CastError for ID format is handled by mongoose.Types.ObjectId.isValid
        return NextResponse.json({ message: `Failed to delete inventory item`, error: error.message }, { status: 500 });
    }
};