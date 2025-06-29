"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";
import { route } from "ziggy-js";
import InputField from "@/src/Components/Auth/InputField";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"), {
            onSuccess: () => {
                window.location.href = "/";
            },
        });
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your Compsphere account"
            status={status}
        >
            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(value) => setData("email", value)}
                    error={errors.email}
                    placeholder="Enter your email"
                    icon={<Mail className="w-5 h-5" />}
                    autoComplete="username"
                    required
                />

                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={(value) => setData("password", value)}
                    error={errors.password}
                    placeholder="Enter your password"
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="current-password"
                    showPasswordToggle
                    required
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ml-2 text-sm text-gray-400">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    disabled={processing}
                    loading={processing}
                    className="w-full"
                >
                    Sign In
                </Button>

                <div className="text-center">
                    <p className="text-gray-400 text-sm sm:text-base">
                        Don't have an account?{" "}
                        <Link
                            href={route("register")}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                            Create one here
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
