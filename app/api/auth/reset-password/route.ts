import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

interface ResetTokenPayload extends JwtPayload {
  id: string; // Chỉ cần id để tìm user
}

// Phương thức POST để xử lý việc đặt lại mật khẩu
export async function POST(request: Request) {
  // Lấy token từ query params (link email) và mật khẩu mới từ body
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const { newPassword } = await request.json();

  console.log("Received reset password request with token:", token);

  if (!token || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Missing token or new password." },
      { status: 400 }
    );
  }

  try {
    // 1. Xác thực Token
    const decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
    const userId = decoded.id;

    // 2. Tìm User
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found or token is invalid/expired." },
        { status: 404 }
      );
    }

    // 3. Mã hóa mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Cập nhật mật khẩu trong DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    // 5. Thành công
    return NextResponse.json(
      { success: true, message: "Password has been successfully reset." },
      { status: 200 }
    );
  } catch (error) {
    // Lỗi có thể là `TokenExpiredError` hoặc `JsonWebTokenError`
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token. Please try the forgot password process again." },
      { status: 400 }
    );
  }
}