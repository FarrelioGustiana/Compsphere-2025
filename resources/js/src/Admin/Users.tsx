import React from "react";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User } from "@/types/models";
import { UsersIcon, Search, Filter } from "lucide-react";
import { route } from "ziggy-js";

interface Props {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        role: string;
    };
}

export default function Users({ users, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        role: filters.role || "",
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData("search", e.target.value);
        // Submit form after typing stops for 300ms
        setTimeout(() => {
            get(route("admin.users"), {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;

        const url = new URL(route("admin.users"));
        if (newRole) url.searchParams.set("role", newRole);
        if (data.search) url.searchParams.set("search", data.search);
        setData("role", newRole);

        window.location.href = url.toString();
    };

    return (
        <DashboardLayout>
            <Head title="User Management" />

            <div className="p-6">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                User Management
                            </h2>
                            <div className="flex items-center space-x-2">
                                <UsersIcon className="h-5 w-5 text-gray-500" />
                                <span>{users.total} Users</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={data.search}
                                    onChange={handleSearchChange}
                                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="w-full sm:w-48 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={data.role}
                                    onChange={handleRoleChange}
                                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="participant">
                                        Participants
                                    </option>
                                    <option value="judge">Judges</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email Status
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.first_name}{" "}
                                                    {user.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            user.email_verified
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {user.email_verified
                                                            ? "Verified"
                                                            : "Not Verified"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                    {user.role}
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                            onClick={() => {
                              // View user details
                              console.log('View user', user.id);
                            }}
                          >
                            View
                          </button>
                        </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {users.data.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {users.from} to {users.to} of{" "}
                                    {users.total} users
                                </div>
                                <div className="flex space-x-1">
                                    {users.links.map((link, index) => (
                                        <button
                                            key={index}
                                            disabled={!link.url}
                                            className={`px-3 py-1 border ${
                                                link.active
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-white text-gray-700"
                                            } rounded-md text-sm ${
                                                !link.url
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() => {
                                                if (link.url) {
                                                    window.location.href =
                                                        link.url;
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
