"use client";

import { redirect } from "next/navigation";
import { useUserStore } from "../store/useUserStore";
import { mockUsers } from "../store/mockData";
import { Edit, Trash2 } from "lucide-react";

export default function UsersPage() {
    const { user } = useUserStore();
    if (user?.role !== "admin") redirect('/');

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="w-full flex items-center pb-5 border-b border-black/10">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>
            <div className="mt-3 rounded-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 text-left text-sm">
                        <tr>
                            <th className="px-6 py-3 w-[25%] border">Email</th>
                            <th className="px-6 py-3 w-[25%] border">Role</th>
                            <th className="px-6 py-3 w-[25%] border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.length === 0 ? (
                            <tr>
                                <td className="px-6 py-6 text-center text-gray-400 border" colSpan={4}>No data</td>
                            </tr>
                        ) : (
                            mockUsers.map((r, index) => (
                                <tr key={index} className="text-sm">
                                    <td className="px-6 py-3 border">
                                        <div className="flex flex-wrap gap-x-2">
                                            <div className="font-medium">
                                                {r.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 border">{r.role}</td>
                                    <td className="px-6 py-3 border flex space-x-2">
                                        <button
                                            className="cursor-pointer border w-[38px] h-8 flex items-center justify-center hover:bg-gray-100 rounded-md px-2.5 py-2 font-medium"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            // onClick={() => setDeleteId(user.userId)}
                                            className="cursor-pointer border w-[38px] h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-gray-100 rounded-md px-2.5 py-2 font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
