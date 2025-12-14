import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

// --- Cấu hình Nodemailer ---
// THAY THẾ bằng thông tin Gmail và Mật khẩu Ứng dụng (App Password) của bạn
const EMAIL_USER = process.env.EMAIL_USER || "your_sender_email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your_app_password"; // PHẢI LÀ APP PASSWORD

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Hàm gửi email xác minh
async function sendVerificationEmail(toEmail: string, token: string) {
  // URL này trỏ đến route handler mới mà chúng ta sẽ tạo
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `Yolo Home <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác minh Địa chỉ Email của bạn",
    html: `
            <h1>Chào mừng đến với Yolo Home!</h1>
            <p>Vui lòng nhấp vào liên kết dưới đây để xác minh địa chỉ email của bạn:</p>
            <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4C6FFF; color: white; text-decoration: none; border-radius: 5px;">
                Xác minh Email
            </a>
            <p>Nếu bạn không thể nhấp vào nút, sao chép và dán liên kết sau vào trình duyệt:</p>
            <p>${verificationLink}</p>
        `,
  };

  await transporter.sendMail(mailOptions);
}


// Hàm gửi email Đặt lại Mật khẩu
async function sendResetPasswordEmail(toEmail: string, token: string) {
  // URL này trỏ đến route handler mới mà chúng ta sẽ tạo, ví dụ: /reset-password?token=...
  // Đây sẽ là một trang UI trên client (Next.js Page) để người dùng nhập mật khẩu mới.
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`; 

  const mailOptions = {
    from: `Yolo Home <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Yêu cầu Đặt lại Mật khẩu",
    html: `
            <h1>Đặt lại Mật khẩu của bạn</h1>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào liên kết dưới đây:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #FF6F61; color: white; text-decoration: none; border-radius: 5px;">
                Đặt lại Mật khẩu
            </a>
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Nếu bạn không thể nhấp vào nút, sao chép và dán liên kết sau vào trình duyệt:</p>
            <p>${resetLink}</p>
        `,
  };

  await transporter.sendMail(mailOptions);
}


// Hàm xử lý yêu cầu Quên Mật khẩu (Chỉ gửi email)
async function handleForgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // LUÔN LUÔN trả về một thông báo thành công chung chung để tránh tiết lộ liệu email có tồn tại hay không.
  if (!user || !user.isVerified) {
    // Vẫn trả về thành công để tránh tấn công enumeration (liệt kê)
    return NextResponse.json(
      { success: true, message: "If an account with that email exists, a password reset link has been sent." },
      { status: 200 }
    );
  }

  try {
    // 1. TẠO RESET TOKEN (hết hạn trong 1 giờ)
    // Token này KHÔNG cần chứa nhiều thông tin, chỉ cần id để xác định người dùng sau này.
    const resetToken = jwt.sign(
      { id: user.id }, 
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    // **LƯU Ý QUAN TRỌNG:** Trong một ứng dụng thực tế, bạn nên mã hóa và lưu trữ `resetToken` trong DB, 
    // và chỉ gửi token thô đã được tạo (ở đây là `resetToken`) qua email.
    // Sau đó, khi người dùng gửi lại token, bạn đối chiếu nó với phiên bản đã lưu trữ trong DB.
    // Tuy nhiên, vì mục đích đơn giản, chúng ta sẽ chỉ dựa vào JWT hết hạn trong 1h.
    
    // 2. GỬI EMAIL ĐẶT LẠI MẬT KHẨU
    await sendResetPasswordEmail(user.email, resetToken);

    return NextResponse.json(
      {
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Error sending password reset email." },
      { status: 500 }
    );
  }
}


async function handleSignup(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists." },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. TẠO USER VỚI isVerified: false
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user",
        isVerified: false, // <-- TRƯỜNG MỚI CẦN CÓ TRONG MODEL PRISMA
      },
    });

    // 2. TẠO VERIFICATION TOKEN (hết hạn trong 1 giờ)
    const verificationToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 3. GỬI EMAIL
    await sendVerificationEmail(newUser.email, verificationToken);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error creating user or sending verification email." },
      { status: 500 }
    );
  }
}

async function handleLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 400 }
    );
  }

  if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email address before logging in." },
        { status: 403 }
      );
    }

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 400 }
    );
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error during login." },
      { status: 500 }
    );
  }
}


// Hàm tiện ích để xác thực Token và lấy userId
function verifyToken(request: Request): AuthPayload | null {
  const authorizationHeader = request.headers.get("Authorization");

  // 1. Kiểm tra header Authorization
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.split(" ")[1];
  try {
    // 2. Xác thực Token
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    // Token không hợp lệ hoặc đã hết hạn
    return null;
  }
}


// Phương thức PUT để xử lý yêu cầu đổi mật khẩu
export async function PUT(request: Request) {

  // 1. XÁC THỰC: Lấy thông tin người dùng từ JWT Token trong Header
  const authInfo = verifyToken(request);
  if (!authInfo) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid or missing token." },
      { status: 401 }
    );
  }
  // Lấy userId an toàn từ token đã giải mã
  const userId = authInfo.id;

  // 2. Lấy dữ liệu từ body request
  const body = await request.json();
  const { currentPassword, newPassword } = body;

  // Loại bỏ body.userId vì nó không an toàn

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Missing current password or new password." },
      { status: 400 }
    );
  }

  try {
    // 3. Lấy thông tin người dùng hiện tại từ DB (dùng userId từ Token)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Trường hợp hiếm khi xảy ra nếu user bị xóa nhưng token còn hiệu lực
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // 4. Xác minh mật khẩu hiện tại
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid current password." },
        { status: 403 } // 403 Forbidden: Yêu cầu hợp lệ nhưng không được phép
      );
    }

    // 5. Kiểm tra mật khẩu mới khác mật khẩu cũ
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: "New password must be different from the current password." },
        { status: 400 }
      );
    }

    // 6. Mã hóa mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 7. Cập nhật mật khẩu trong DB
    await prisma.user.update({
      where: { id: userId }, // Đảm bảo cập nhật đúng user đã được xác thực
      data: {
        password: hashedPassword,
      },
    });

    // 8. Thành công
    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { action, email, password } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "signup":
        return await handleSignup(email, password);
      case "login":
        return await handleLogin(email, password);
      case "forgot-password":
        // Chỉ cần email
        if (!email) throw new Error("Missing email for forgot password.");
        return await handleForgotPassword(email);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
