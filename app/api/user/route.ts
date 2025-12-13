import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleGetHistoryData(
  userId: string,
  timestampFilter: "All" | "Year" | "Month" | "Week" | "Day"
) {
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId in request body." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  }

  try {
    const now = Date.now();
    let timestampFilterDate: number;
    switch (timestampFilter) {
      case "Year":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        timestampFilterDate = oneYearAgo.getTime();
        break;
      case "Month":
        timestampFilterDate = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "Week":
        timestampFilterDate = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "Day":
        timestampFilterDate = now - 24 * 60 * 60 * 1000;
        break;
      default:
        timestampFilterDate = 0;
    }

    const historyTemperatureData = await prisma.rt.findMany({
      where: {
        timestamp_local: {
          gte: new Date(timestampFilterDate),
        },
      },
      orderBy: {
        timestamp_local: "desc",
      },
    });

    const historyHumidityData = await prisma.rh.findMany({
      where: {
        timestamp_local: {
          gte: new Date(timestampFilterDate),
        },
      },
      orderBy: {
        timestamp_local: "desc",
      },
    });

    const historyLightData = await prisma.lux.findMany({
      where: {
        timestamp_local: {
          gte: new Date(timestampFilterDate),
        },
      },
      orderBy: {
        timestamp_local: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        historyTemperatureData,
        historyHumidityData,
        historyLightData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching history data." },
      { status: 500 }
    );
  }
}

async function handleUpdateData(
  userId: string,
  rowId: string,
  newValue: number,
  sensor: "Temperature" | "Humidity" | "Light"
) {
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId in request body." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  }

  try {
    let updatedRecord;
    switch (sensor) {
      case "Temperature":
        updatedRecord = await prisma.rt.update({
          where: { id: rowId },
          data: { value: newValue },
        });
        break;
      case "Humidity":
        updatedRecord = await prisma.rh.update({
          where: { id: rowId },
          data: { value: newValue },
        });
        break;
      case "Light":
        updatedRecord = await prisma.lux.update({
          where: { id: rowId },
          data: { value: newValue },
        });
        break;
    }
    return NextResponse.json({ success: true, updatedRecord }, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { success: false, message: "Error updating data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { action, token, userId } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token in request body." },
        { status: 400 }
      );
    }

    let decoded: { id: string; email: string; role: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 403 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "getHistoryData":
        const { timestampFilter } = body;
        return await handleGetHistoryData(userId, timestampFilter);
      case "updateData":
        const { rowId, newValue, sensor } = body;
        return await handleUpdateData(userId, rowId, newValue, sensor);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in admin POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
