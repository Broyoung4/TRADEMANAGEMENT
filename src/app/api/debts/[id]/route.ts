// /api/debts/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/utils/database";
import Debt from "@/models/debt";
import Sales from "@/models/sales";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const loggedInUserId = session.user.id;

  try {
    await connectToDB();
    const debt = await Debt.findById(params.id);

    if (!debt) {
      return NextResponse.json({ message: "Debt not found." }, { status: 404 });
    }

    // Authorization: Check if debt belongs to logged-in user
    if (debt.userId.toString() !== loggedInUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(debt, { status: 200 });
  } catch (error) {
    console.error("Error fetching debt:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to fetch debt", error: errorMessage },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const loggedInUserId = session.user.id;

  try {
    await connectToDB();
    const debt = await Debt.findById(params.id);

    if (!debt) {
      return NextResponse.json({ message: "Debt not found." }, { status: 404 });
    }

    // Authorization
    if (debt.userId.toString() !== loggedInUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { amountPaid, note } = body;

    if (amountPaid === undefined || amountPaid < 0) {
      return NextResponse.json(
        { message: "Invalid amount paid." },
        { status: 400 }
      );
    }

    // Update amount paid
    debt.amountPaid = Math.min(debt.totalAmount, debt.amountPaid + amountPaid);
    debt.lastPaymentDate = new Date();

    // Add to payment history
    debt.paymentHistory.push({
      amountPaid,
      paymentDate: new Date(),
      note: note || "",
    });

    // Save debt first to calculate new status
    const updatedDebt = await debt.save();

    // Check if debt is now settled, and if so, update the sale's profit
    if (updatedDebt.debtStatus === "settled" && updatedDebt.saleId) {
      try {
        const sale = await Sales.findById(updatedDebt.saleId);
        if (sale) {
          // Update the sale's profit with the original profit stored in debt
          sale.profit = updatedDebt.originalProfit;
          sale.isDebt = false; // Mark as no longer a debt
          await sale.save();
          console.log(`Debt settled: Added profit of ${updatedDebt.originalProfit} back to sale ${updatedDebt.saleId}`);
        }
      } catch (error) {
        console.error("Error updating sale profit when debt settled:", error);
        // Don't throw error here - debt payment was successful, just log the issue
      }
    }

    return NextResponse.json(updatedDebt.toObject(), { status: 200 });
  } catch (error) {
    console.error("Error updating debt:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to update debt", error: errorMessage },
      { status: 500 }
    );
  }
};

export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const loggedInUserId = session.user.id;

  try {
    await connectToDB();
    const debt = await Debt.findById(params.id);

    if (!debt) {
      return NextResponse.json({ message: "Debt not found." }, { status: 404 });
    }

    // Authorization
    if (debt.userId.toString() !== loggedInUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Debt.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Debt deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting debt:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to delete debt", error: errorMessage },
      { status: 500 }
    );
  }
};
