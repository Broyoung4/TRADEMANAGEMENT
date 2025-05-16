export const POST = async (request) => {
    try {
        await connectToDB();
        const body = await request.json();
        const { itemId, quantitySold, sellingPrice, profit, unitSold, costPriceAtTimeOfSale } = body;

        if (!itemId || quantitySold === undefined || sellingPrice === undefined || profit === undefined || !unitSold || costPriceAtTimeOfSale === undefined) {
            return NextResponse.json({ message: 'Missing required fields for sale record.' }, { status: 400 });
        }

        const inventoryItem = await Inventory.findById(itemId);
        if (!inventoryItem) {
            return NextResponse.json({ message: 'Inventory item not found.', item: itemId }, { status: 404 });
        }

        const newSale = await Sales.create({
            itemId,
            itemName: inventoryItem.itemName, // Store the item name in the sale record
            quantitySold,
            sellingPrice,
            profit,
            saleDate: new Date(),
            unitSold,
            costPriceAtTimeOfSale,
        });

        return NextResponse.json(newSale, { status: 201 });
    } catch (error) {
        console.error('Error recording sale:', error);
        return NextResponse.json({ message: 'Failed to record sale', error: error.message }, { status: 500 });
    }
};