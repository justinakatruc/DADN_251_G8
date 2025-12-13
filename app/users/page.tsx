"use client";

import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { User } from "../model";
import { adminAPI } from "@/lib/api";

// type Device = {
//   id: number;
//   name: string;
//   ownerId: number;
// };

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
    </tr>
  );
}

type FormErrors = {
  [key: string]: string;
};

export default function UsersPage() {
  const { user } = useUserStore();
  const [userList, setUserList] = useState<User[]>([]);
  const [edit, setEdit] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<{
    email: string;
    role: string;
    id: string;
  } | null>(null);
  const [originalUser, setOriginalUser] = useState<{
    email: string;
    role: string;
  } | null>(null);
  const [emailEditUser, setEmailEditUser] = useState("");
  const [roleEditUser, setRoleEditUser] = useState("");
  // const [listDevices, setListDevices] = useState<Device[]>([]);
  // const [listRemovingDevices, setListRemovingDevices] = useState<Device[]>([]);
  // const [listAddingDevices, setListAddingDevices] = useState<Device[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  // const [deviceName, setDeviceName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async (userId: string) => {
    const result = await adminAPI.deleteUser(
      userId,
      localStorage.getItem("token") || ""
    );

    if (result.success) {
      await fetchUsers();
      toast.success("User deleted successfully");
    } else {
      toast.error("Failed to delete user");
    }
  };

  const handleAddUser = async () => {
    const newErrors: FormErrors = {};
    const trimmedEmail = newUserEmail.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Email is invalid.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsAddingUser(true);
    const result = await adminAPI.addUser(
      { email: trimmedEmail, role: newUserRole },
      localStorage.getItem("token") || ""
    );

    if (result.success) {
      await fetchUsers();
      setIsAddingUser(false);
      setShowAddUserModal(false);
      setNewUserEmail("");
      setNewUserRole("user");
      setErrors({});
      toast.success("User added successfully");
    } else {
      setIsAddingUser(false);
      toast.error(result.message || "Failed to add user");
    }
  };

  // const handleDeleteDevice = (deviceId: number) => {
  //   setListDevices((prev) => prev.filter((d) => d.id !== deviceId));
  //   setListRemovingDevices((prev) => [
  //     ...prev,
  //     { id: deviceId, name: "", ownerId: editUser?.id || 0 },
  //   ]);
  //   toast.success("Device deleted successfully");
  // };

  // const handleAddDevice = async () => {
  //   const newErrors: FormErrors = {};
  //   const trimmed = deviceName.trim();
  //   if (!trimmed) {
  //     newErrors.deviceName = "Device name is required.";
  //   } else if (trimmed.length > 50) {
  //     newErrors.deviceName = "Device name must be less than 50 characters.";
  //   } else if (/\s/.test(trimmed)) {
  //     newErrors.deviceName = "Device name must be a single word (no spaces).";
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const existingDevices = listDevices.map((d) => d.name.toLowerCase());
  //   if (existingDevices.includes(trimmed.toLowerCase())) {
  //     setErrors({ deviceName: "Device name already exists." });
  //     setIsEditing(false);
  //     toast.error("Device name already exists in the list.");
  //     return;
  //   }

  //   const newDevice: Device = {
  //     id: Math.max(0, ...mockDevices.map((d) => d.id)) + 1,
  //     name: trimmed,
  //     ownerId: editUser ? editUser.id : 0,
  //   };
  //   setListDevices((prev) => [...prev, newDevice]);
  //   setListAddingDevices((prev) => [...prev, newDevice]);
  //   setDeviceName("");
  //   setIsEditing(false);
  //   toast.success("Device added successfully");
  // };

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await adminAPI.getUsers(localStorage.getItem("token") || "");
    if (result.success) {
      setUserList(result.users);
    }
    setIsLoading(false);
  };

  const handleUpdateUser = async () => {
    const newErrors: FormErrors = {};
    const trimmedEmail = emailEditUser.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Email is invalid.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsEditing(true);
    const result = await adminAPI.updateUser(
      editUser!.id,
      { email: trimmedEmail, role: roleEditUser as "admin" | "user" },
      localStorage.getItem("token") || ""
    );
    if (result.success) {
      await fetchUsers();
      setIsEditing(false);
      setEdit(null);
      setEditUser(null);
      setOriginalUser(null);
      setErrors({});
      toast.success("User updated successfully");
    } else {
      setIsEditing(false);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editUser) {
      setEmailEditUser(editUser.email);
      setRoleEditUser(editUser.role);
      // const devices = mockDevices.filter((d) => d.ownerId === editUser.id);
      // setListDevices(devices);
    } else {
      setEmailEditUser("");
      setRoleEditUser("");
      // setListDevices([]);
    }
  }, [editUser]);

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-5 border-b border-black/10">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={() => setShowAddUserModal(true)}>
          <span className="bg-(--bg-button) text-white rounded-md px-4 py-2 hover:bg-(--bg-button-hover) cursor-pointer">
            Add New User
          </span>
        </button>
      </div>
      <div className="mt-3 rounded-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
        <table className="min-w-[700px] w-full table-fixed">
          <thead className="bg-gray-50 text-left text-sm">
            <tr>
              <th className="px-6 py-3 w-[25%] border">ID</th>
              <th className="px-6 py-3 w-[25%] border">Email</th>
              <th className="px-6 py-3 w-[25%] border">Role</th>
              <th className="px-6 py-3 w-[25%] border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Show loading skeleton rows
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : userList.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-6 text-center text-gray-400 border"
                  colSpan={4}
                >
                  No data
                </td>
              </tr>
            ) : (
              userList.map((r, index) => (
                <tr key={index} className="text-sm">
                  <td className="px-6 py-3 border">
                    {r.id.length > 15 ? r.id.substring(0, 15) + "..." : r.id}
                  </td>
                  <td className="px-6 py-3 border">
                    <div className="flex flex-wrap gap-x-2">
                      <div className="font-medium">{r.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3 border capitalize">{r.role}</td>
                  <td className="px-6 py-3 border flex space-x-2">
                    <button
                      className="cursor-pointer border w-[38px] h-8 flex items-center justify-center hover:bg-gray-100 rounded-md px-2.5 py-2 font-medium"
                      onClick={() => {
                        setEdit(r.id);
                        setEditUser({ email: r.email, role: r.role, id: r.id });
                        setOriginalUser({ email: r.email, role: r.role });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user?.id !== r.id && (
                      <button
                        onClick={() => handleDeleteUser(r.id)}
                        className="cursor-pointer border w-[38px] h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-gray-100 rounded-md px-2.5 py-2 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {edit !== null && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
            onClick={() => {
              setEdit(null);
              setEditUser(null);
              setErrors({});
            }}
          >
            <div
              className="bg-white rounded-[20px] max-w-[400px] w-full p-6 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Edit User</h2>
              <label className="self-start mb-2 font-medium">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                value={emailEditUser}
                onChange={(e) => setEmailEditUser(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 mb-4">{errors.email}</p>
              )}
              <label className="self-start mb-2 font-medium">Role</label>
              <select
                className="border border-gray-300 rounded-md p-2 w-full mb-4 cursor-pointer"
                value={roleEditUser}
                onChange={(e) => setRoleEditUser(e.target.value)}
                disabled={isEditing || editUser?.role === "admin"}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.ownerId && (
                <p className="text-red-500 mb-4">{errors.ownerId}</p>
              )}
              {/* <label className="self-start mb-2 font-medium">List Devices</label>
                            <div className="w-full max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 mb-4">
                                {listDevices.length === 0 ? (
                                    <p className="text-gray-500">No devices assigned.</p>
                                ) : (
                                    <ul className="flex flex-col gap-1">
                                        {listDevices.map(device => (
                                            <li key={device.id} className="text-sm flex items-center gap-x-2">
                                                <button
                                                    className="size-[20px] rounded-full border flex items-center justify-center bg-[#FF5C5C] hover:opacity-90 cursor-pointer"
                                                    onClick={() => handleDeleteDevice(device.id)}
                                                >
                                                    <X className="text-white" size={16} />
                                                </button>
                                                <div>
                                                    {device.name}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="w-full flex gap-x-4">
                                <input
                                    type="text"
                                    placeholder="Device Name"
                                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                                    value={deviceName}
                                    onChange={(e) => setDeviceName(e.target.value)}
                                />
                                <button
                                    className="h-[42px] bg-(--bg-button) text-white rounded-md px-4 py-2 hover:bg-(--bg-button-hover) cursor-pointer"
                                    onClick={handleAddDevice}
                                    disabled={isEditing}
                                >
                                    Add
                                </button>
                            </div>
                            {errors.deviceName && (
                                <p className="text-red-500 mb-4">{errors.deviceName}</p>
                            )} */}
              <button
                className="bg-(--bg-button) text-white rounded-md px-4 py-2 w-full hover:bg-(--bg-button-hover) cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                disabled={
                  isEditing ||
                  (emailEditUser === originalUser?.email &&
                    roleEditUser === originalUser?.role)
                }
                onClick={handleUpdateUser}
              >
                {isEditing ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
        {showAddUserModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
            onClick={() => {
              setShowAddUserModal(false);
              setNewUserEmail("");
              setNewUserRole("user");
              setErrors({});
            }}
          >
            <div
              className="bg-white rounded-[20px] max-w-[400px] w-full p-6 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Add New User</h2>
              <label className="self-start mb-2 font-medium">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 mb-4">{errors.email}</p>
              )}
              <label className="self-start mb-2 font-medium">Role</label>
              <select
                className="border border-gray-300 rounded-md p-2 w-full mb-4 cursor-pointer"
                value={newUserRole}
                onChange={(e) =>
                  setNewUserRole(e.target.value as "admin" | "user")
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="bg-(--bg-button) text-white rounded-md px-4 py-2 w-full hover:bg-(--bg-button-hover) cursor-pointer"
                disabled={isAddingUser}
                onClick={handleAddUser}
              >
                {isAddingUser ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
