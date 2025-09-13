import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { PageProps } from "@/types";
import { User } from "@/types/models";
import { UsersIcon, PlusCircle, Search, Trash2 } from "lucide-react";
import { route } from "ziggy-js";

interface JudgeUser extends User {
    judge_full_name: string;
}

interface Props {
    judges: JudgeUser[];
}

export default function JudgeManagement({ judges }: Props & PageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const { delete: deleteJudge } = useForm();

    const filteredJudges = searchTerm
        ? judges.filter(
              (judge) =>
                  judge.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  judge.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  judge.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  judge.judge_full_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : judges;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const confirmDelete = (judgeId: number) => {
        setConfirmingDelete(judgeId);
    };

    const handleDelete = (judgeId: number) => {
        deleteJudge(route("admin.manage.users.delete", { user: judgeId }), {
            onSuccess: () => {
                setConfirmingDelete(null);
            },
        });
    };

    const cancelDelete = () => {
        setConfirmingDelete(null);
    };

    return (
        <DashboardLayout>
            <Head title="Judge Management" />

            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Judge Management
                            </h2>
                            <Link
                                href={route("admin.manage.judges.create")}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Judge
                            </Link>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search judges..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            User Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Judge Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Email Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredJudges.length > 0 ? (
                                        filteredJudges.map((judge) => (
                                            <tr key={judge.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {judge.first_name} {judge.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {judge.judge_full_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {judge.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            judge.email_verified
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}
                                                    >
                                                        {judge.email_verified
                                                            ? "Verified"
                                                            : "Not Verified"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {confirmingDelete === judge.id ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleDelete(judge.id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={cancelDelete}
                                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => confirmDelete(judge.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                No judges found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
