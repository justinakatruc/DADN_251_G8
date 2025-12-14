"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

// Giao diện cho component cơ bản (AuthTemplate) được tái sử dụng
interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

// Tái sử dụng AuthTemplate từ AuthOverlay (không cần prop onClose)
function AuthTemplate({ title, subtitle, children }: AuthTemplateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center caret-transparent select-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] items-center" />
      <div className="relative flex flex-col w-full max-w-sm sm:max-w-md bg-white rounded-2xl items-start justify-center mx-2 px-2 py-6 sm:p-6">
        <div className="w-full text-center">
          <h2 className="text-[#262626] font-semibold text-3xl md:text-4xl">
            {title}
          </h2>
          <p className="text-[#4d4d4d] text-sm sm:text-base mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

type FormErrors = {
  [key: string]: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ URL query
  
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true); // Giả định token hợp lệ ban đầu
  
  // Kiểm tra sự tồn tại của token khi component mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      toast.error("Missing password reset token in URL.");
    }
  }, [token]);


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!token || !isTokenValid) {
        toast.error("Invalid or missing token.");
        return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Gửi POST request đến route handler /api/auth/reset-password?token=...
      const result = await authAPI.resetPassword({
        token: token,
        newPassword: newPassword,
      });

      if (result.success) {
        toast.success("Password reset successful! Redirecting to login...");
        // Chuyển hướng về trang chủ hoặc trang đăng nhập sau 2 giây
        setTimeout(() => {
          router.push("/"); 
        }, 2000);
      } else {
        toast.error(result.message || "Password reset failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
        <AuthTemplate
            title="Error"
            subtitle="Invalid or expired link."
        >
            <div className="w-full text-center mt-4">
                <p className="text-red-500 mb-4">The password reset link is missing or invalid. Please try the forgot password process again.</p>
                <button
                    onClick={() => router.push("/")}
                    className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-4 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    Go to Home
                </button>
            </div>
        </AuthTemplate>
    );
  }

  return (
    <AuthTemplate
      title="Reset Password"
      subtitle="Enter and confirm your new password."
    >
      <form onSubmit={handleResetPassword} className="flex flex-col w-full items-start my-2 px-2 md:px-0">
        <div className="w-full my-2">
          <div className="w-full mb-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              New Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                type="password"
                placeholder="Enter new Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {errors.newPassword && (
              <div className="text-red-500 text-sm">{errors.newPassword}</div>
            )}
          </div>
          <div className="w-full mt-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              Confirm New Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                type="password"
                placeholder="Confirm new Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm">{errors.general}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-4 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </AuthTemplate>
  );
}