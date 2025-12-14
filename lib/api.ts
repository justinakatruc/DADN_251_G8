import { Metric } from "@/app/model";

const BASE_API = "http://localhost:3000/api";

export const authAPI = {
  signup: async (usersData: { email: string; password: string }) => {
    const reponse = await fetch(`${BASE_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "signup",
        ...usersData,
      }),
    });
    return reponse.json();
  },

  login: async (usersData: { email: string; password: string }) => {
    const reponse = await fetch(`${BASE_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        ...usersData,
      }),
    });
    return reponse.json();
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${BASE_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "forgotPassword",
        email,
      }),
    });
    return response.json();
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await fetch(`${BASE_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "resetPassword",
        token,
        newPassword,
      }),
    });
    return response.json();
  },

};

export const userAPI = {
  getHistoryData: async (
    userId: string,
    token: string,
    timestampFilter: "All"| "Year" | "Month" | "Week" | "Day"
  ) => {
    const response = await fetch(`${BASE_API}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getHistoryData",
        userId,
        token,
        timestampFilter,
      }),
    });
    return response.json();
  },
  updateData: async (
    userId: string,
    token: string,
    rowId: string,
    newValue: number,
    sensor: Metric
  ) => {
    const response = await fetch(`${BASE_API}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateData",
        userId,
        token,
        rowId,
        newValue,
        sensor,
      }),
    });
    return response.json();
  },
  changePassword: async (
// userId không cần thiết trong URL nếu Route Handler là /api/auth
    // nhưng ta vẫn giữ để đảm bảo token được lấy
    userId: string, 
    token: string,
    currentPassword: string,
    newPassword: string
) => {
    try {
        // Giả sử Route Handler được đặt tại /api/auth/route.ts
        const response = await fetch(`${BASE_API}/auth`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                // Gửi token để Server xác minh userId
                Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify({ 
                currentPassword: currentPassword, 
                newPassword: newPassword 
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Trả về thông báo lỗi chi tiết từ server (ví dụ: Invalid current password)
            return { success: false, message: data.message || "Server error occurred." };
        }

        return { success: true, message: "Password updated successfully." };
    } catch (error) {
        console.error("API error in changePassword:", error);
        return { success: false, message: "Network error or internal client issue." };
    }
  },
};

export const adminAPI = {
  addUser: async (
    userData: { email: string; role: "admin" | "user" },
    token: string
  ) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "addUser", ...userData, token }),
    });
    return response.json();
  },

  getUsers: async (token: string) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "getUsers", token }),
    });
    return response.json();
  },

  deleteUser: async (userId: string, token: string) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "deleteUser", token, userId }),
    });
    return response.json();
  },

  updateUser: async (
    userId: string,
    updateData: { email?: string; role?: "admin" | "user" },
    token: string
  ) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateUser",
        ...updateData,
        token,
        userId,
      }),
    });
    return response.json();
  },
};
