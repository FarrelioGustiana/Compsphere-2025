import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Eye, EyeOff, Save, Mail, Award } from "lucide-react";
import { route } from "ziggy-js";

export default function CreateJudgeForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        full_name: '',
        send_credentials: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.create-judge'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-200 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Create Judge Account
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                    Create a new judge account for event evaluation and scoring.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Enter first name"
                            required
                        />
                        {errors.first_name && (
                            <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Enter last name"
                            required
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Full Name for Judge Profile */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
                        Full Name (For Judge Profile)
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Enter full professional name"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        This will be displayed in judge listings and event materials.
                    </p>
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Enter email address"
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>
                        )}
                    </div>
                </div>

                {/* Send Credentials Option */}
                <div className="flex items-center">
                    <input
                        id="send_credentials"
                        type="checkbox"
                        checked={data.send_credentials}
                        onChange={(e) => setData('send_credentials', e.target.checked as any)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="send_credentials" className="ml-2 block text-sm text-gray-300">
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            Send login credentials via email
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            The new judge will receive their login details via email.
                        </p>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        disabled={processing}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Create Judge
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
