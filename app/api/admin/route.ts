import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleAddUser(userData: {
  email: string;
  role: "admin" | "user";
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 400 }
      );
    }

    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        role: userData.role,
        password: hashedPassword,
        isVerified: true,
      },
    });
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { success: false, message: "Error adding user." },
      { status: 500 }
    );
  }
}

async function handleGetUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users." },
      { status: 500 }
    );
  }
}

async function handleUpdateUser(
  userId: string,
  updateData: { email: string; role: "admin" | "user" }
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: updateData.email,
        role: updateData.role,
      },
    });
    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Error updating user." },
      { status: 500 }
    );
  }
}

async function handleDeleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting user." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { action, token } = body;

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
      case "addUser":
        const { email, role } = body;
        return await handleAddUser({ email, role });
      case "getUsers":
        return await handleGetUsers();
      case "updateUser":
        const { userId, ...updateData } = body;
        return await handleUpdateUser(userId, updateData);
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { action, token } = body;

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
      case "deleteUser":
        const { userId } = body;
        return await handleDeleteUser(userId);
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
