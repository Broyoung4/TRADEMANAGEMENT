// /api/debts/route.ts
import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/utils/database";
import Debt from "@/models/debt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const loggedInUserId = session.user.id;

  try {
    await connectToDB();
    const debts = await Debt.find({ userId: loggedInUserId }).sort({
      createdDate: -1,
    });
    return NextResponse.json(debts, { status: 200 });
  } catch (error) {
    console.error("Error fetching debts:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to fetch debts", error: errorMessage },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const loggedInUserId = session.user.id;

  try {
    await connectToDB();
    const body = await request.json();
    const {
      saleId,
      itemName,
      customerName,
      totalAmount,
      amountPaid = 0,
      originalProfit = 0,
    } = body;

    // Validate required fields
    if (!saleId) {
      return NextResponse.json(
        { message: "Sale ID is required." },
        { status: 400 }
      );
    }
    if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
      return NextResponse.json(
        { message: "Item name is required and must be a non-empty string." },
        { status: 400 }
      );
    }
    if (totalAmount === undefined || totalAmount === null) {
      return NextResponse.json(
        { message: "Total amount is required." },
        { status: 400 }
      );
    }
    if (typeof totalAmount !== 'number' || totalAmount < 0) {
      return NextResponse.json(
        { message: "Total amount must be a non-negative number." },
        { status: 400 }
      );
    }
    if (typeof amountPaid !== 'number' || amountPaid < 0) {
      return NextResponse.json(
        { message: "Amount paid must be a non-negative number." },
        { status: 400 }
      );
    }

    // Check if debt already exists for this sale
    const existingDebt = await Debt.findOne({ saleId });
    if (existingDebt) {
      return NextResponse.json(
        { message: "Debt already exists for this sale." },
        { status: 400 }
      );
    }

    const newDebt = new Debt({
      saleId,
      userId: loggedInUserId,
      itemName: itemName.trim(),
      customerName: (customerName && typeof customerName === 'string') ? customerName.trim() : "Unknown",
      totalAmount,
      amountPaid,
      amountOwed: totalAmount - amountPaid, // Explicitly set for validation
      originalProfit,
    });

    console.log("Saving debt document:", {
      saleId,
      userId: loggedInUserId,
      itemName: newDebt.itemName,
      totalAmount,
      amountPaid,
      amountOwed: newDebt.amountOwed,
    });

    const savedDebt = await newDebt.save();
    console.log("Debt saved successfully:", savedDebt._id);
    return NextResponse.json(savedDebt.toObject(), { status: 201 });
  } catch (error) {
    console.error("Error in debt POST:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        message: "Failed to create debt", 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
};
