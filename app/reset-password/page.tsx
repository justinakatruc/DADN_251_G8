"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";
import { AuthTemplate } from "../components/AuthOverlay";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid reset link");
      router.push("/");
    }
  }, [searchParams, router]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.resetPassword(token, newPassword);

      if (result.success) {
        toast.success(
          "Password reset successful! You can now login with your new password."
        );
        router.push("/");
      } else {
        setErrors({
          general:
            result.message || "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setErrors({
        general: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
      router.push("/");
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <AuthTemplate
      title="Reset Password"
      subtitle="Enter your new password below."
      onClose={handleClose}
    >
      <div className="flex flex-col w-full items-start my-2 px-2 md:px-0">
        <form onSubmit={handleResetPassword} className="w-full space-y-4">
          <div className="w-full flex flex-col gap-y-1 my-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              New Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                placeholder="Enter your new password"
              />
            </div>
            {errors.newPassword && (
              <div className="text-red-500 text-sm">{errors.newPassword}</div>
            )}
          </div>

          <div className="w-full flex flex-col gap-y-1 my-2">
            <label className="text-[#262626] text-sm sm:text-base font-medium">
              Confirm New Password
            </label>
            <div className="w-full bg-gray-100 border-xl border-gray-400 rounded-md my-2">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 sm:p-4 placeholder:text-[#666666] bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                placeholder="Confirm your new password"
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {errors.general && (
            <div className="text-red-500 text-sm w-full">{errors.general}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="block w-full bg-[#4E7EF9] rounded-md text-center p-2 my-8 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="flex flex-row justify-center w-full mt-6 text-[#262626] text-sm sm:text-base font-medium">
          <p>Remember your password?</p>
          <p
            onClick={() => router.push("/")}
            className="underline cursor-pointer hover:text-blue-500 ml-1 transition-colors"
          >
            Back to Login
          </p>
        </div>
      </div>
    </AuthTemplate>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            <div className="relative bg-white rounded-2xl p-8">
              <div className="text-gray-700 font-medium">Loading...</div>
            </div>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
