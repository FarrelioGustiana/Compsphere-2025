import React, { useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";
import { route } from "ziggy-js";
import InputField from "@/src/Components/Auth/InputField";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.update"));
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new password for your account"
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
                    label="New Password"
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={(value) => setData("password", value)}
                    error={errors.password}
                    placeholder="Enter your new password"
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                    showPasswordToggle
                    required
                />

                <InputField
                    label="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(value) => setData("password_confirmation", value)}
                    error={errors.password_confirmation}
                    placeholder="Confirm your new password"
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                    showPasswordToggle
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
                    Reset Password
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
