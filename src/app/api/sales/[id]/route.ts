// /api/sales/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from "../../../../utils/database";
import Sales from "../../../../models/sales";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust this path
import mongoose from 'mongoose';


export async function DELETE(request, { params }) { // request is used by getServerSession
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const loggedInUserId = session.user.id;

    try {
        await connectToDB();
        const { id: saleId } = params;

        if (!saleId || !mongoose.Types.ObjectId.isValid(saleId)) {
            return NextResponse.json({ message: "Invalid or missing Sale ID" }, { status: 400 });
        }

        const saleToDelete = await Sales.findById(saleId);
        if (!saleToDelete) {
            return NextResponse.json({ message: "Sale record not found" }, { status: 404 });
        }

        // Authorization: Check if the sale record belongs to the logged-in user
        if (saleToDelete.userId.toString() !== loggedInUserId) {
            return NextResponse.json({ message: "Forbidden: You do not own this resource" }, { status: 403 });
        }

        // Note: The frontend message says "Inventory NOT automatically restocked".
        // If you were to implement restocking, you'd also need to check ownership of the inventory item.
        // For example:
        // const inventoryItem = await Inventory.findById(saleToDelete.itemId);
        // if (inventoryItem && inventoryItem.userId.toString() !== loggedInUserId) {
        //     return NextResponse.json({ message: "Cannot restock inventory for an item you do not own." }, { status: 403 });
        // }
        // Then proceed with restocking if inventoryItem.userId matches.

        await Sales.findByIdAndDelete(saleId); // Authorized, so proceed with deletion.

        return NextResponse.json({
            message: "Sale record deleted successfully. Profit adjusted on client-side. Inventory NOT automatically restocked by this backend operation.",
            deletedId: saleId
        }, { status: 200 });

    } catch (error) {
        console.error(`Error deleting sale record with ID ${params.id}:`, error);
        // CastError is covered by mongoose.Types.ObjectId.isValid check
        return NextResponse.json({ message: "Failed to delete sale record", error: error.message }, { status: 500 });
    }
}