// Filename: app/api/sales/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from "../../../../utils/database"; // Adjust path
import Sales from "../../../../models/sales";             // Adjust path
import Inventory from "../../../../models/inventory";     // Adjust path

export async function DELETE(request, { params }) {
    try {
        await connectToDB();
        const { id: saleId } = params; // Sale ID from the dynamic route segment

        if (!saleId) {
            return NextResponse.json({ message: "Sale ID is required" }, { status: 400 });
        }

        const saleToDelete = await Sales.findById(saleId);
        if (!saleToDelete) {
            return NextResponse.json({ message: "Sale record not found" }, { status: 404 });
        }

        // Optional: Restore inventory quantity.
        // The frontend currently doesn't expect this and adjusts profit locally.
        // If you enable this, ensure frontend expectations match.
        // For now, I'm commenting it out as per your frontend's current alert message.
        /*
        const inventoryItem = await Inventory.findById(saleToDelete.itemId);
        if (inventoryItem) {
            const conversionFactor = Number(inventoryItem.conversionFactor) || 1;
            const quantityToRestoreInStockUnits = saleToDelete.quantitySold / conversionFactor;
            inventoryItem.quantity += quantityToRestoreInStockUnits;
            await inventoryItem.save();
        }
        */
       
        await Sales.findByIdAndDelete(saleId);

        return NextResponse.json({ message: "Sale record deleted successfully. Profit adjusted on client-side. Inventory NOT automatically restocked by this backend operation.", deletedId: saleId }, { status: 200 });

    } catch (error) {
        console.error(`Error deleting sale record with ID ${params.id}:`, error);
        if (error.name === 'CastError' && error.path === '_id') {
            return NextResponse.json({ message: "Invalid sale ID format" }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to delete sale record", error: error.message }, { status: 500 });
    }
}