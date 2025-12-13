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
