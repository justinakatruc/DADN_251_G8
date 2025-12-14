"use client";

import { useState } from "react";
import Image from "next/image";
import TopBar from "@/app/components/TopBar"; // Giả định TopBar vẫn được dùng
import { useUserStore } from "../store/useUserStore"; // Dùng để lấy thông tin user
import { userAPI } from "@/lib/api"; // Dùng để gọi API đổi mật khẩu
import { toast } from "sonner"; // Dùng để hiển thị thông báo

// Component chính cho trang Profile
export default function ProfilePage() {
  const { user } = useUserStore(); // Lấy user và hàm setUser từ store
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý logic đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API để đổi mật khẩu
      const response = await userAPI.changePassword(
        user.id,
        localStorage.getItem("token") || "",
        currentPassword,
        newPassword
      );

      if (response.success) {
        toast.success("Password changed successfully!");
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        // Giả định API trả về thông báo lỗi cụ thể
        toast.error(response.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-6 border-b border-black/10">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {/* Có thể thêm nút chỉnh sửa profile ở đây nếu cần */}
      </div>

      {/* TopBar (có thể bỏ qua nếu không cần bộ lọc nào) */}
      <TopBar showAddButton={false} />

      {!user ? (
        <div className="w-full h-[500px] flex flex-col items-center justify-center">
          <Image
            src="/icons/yolohome.png"
            alt="Yolo Home"
            width={225}
            height={225}
          />
          <p className="mt-4 text-gray-500">
            Please log in to view your profile.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {/* Section 1: User Information */}
          <div className="border p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">
                  User ID
                </label>
                <p className="text-gray-900 font-bold">{user.id}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900 font-bold">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Change Password Form */}
          <div className="border p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full md:w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full md:w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 block w-full md:w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-40 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4C6FFF] hover:opacity-90 cursor-pointer"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
