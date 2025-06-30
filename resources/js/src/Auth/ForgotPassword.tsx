import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Mail } from "lucide-react";
import { route } from "ziggy-js";
import InputField from "@/src/Components/Auth/InputField";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to reset your password"
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

                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    disabled={processing}
                    loading={processing}
                    className="w-full"
                >
                    Send Reset Link
                </Button>

                <div className="text-center">
                    <p className="text-gray-400 text-sm sm:text-base">
                        Remember your password?{" "}
                        <Link
                            href={route("login")}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
