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
    }>({
        email: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"));
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
