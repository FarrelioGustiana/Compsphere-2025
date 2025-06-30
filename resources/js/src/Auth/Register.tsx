import type React from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { User, Mail, Lock } from "lucide-react";
import { route } from "ziggy-js";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import InputField from "@/src/Components/Auth/InputField";
import Button from "@/src/Components/UI/Button";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
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
        post(route("register"), {
            onSuccess: () => {
                window.location.href = "/verify-email";
            },
        });
    };

    return (
        <AuthLayout
            title="Join Compsphere 2025"
            subtitle="Create your account to be part of the innovation"
        >
            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                <InputField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={(value) => setData("name", value)}
                    error={errors.name}
                    placeholder="Enter your full name"
                    icon={<User className="w-5 h-5" />}
                    autoComplete="name"
                    required
                />

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
                    placeholder="Create a password"
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
                    onChange={(value) =>
                        setData("password_confirmation", value)
                    }
                    error={errors.password_confirmation}
                    placeholder="Confirm your password"
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
                    Create Account
                </Button>

                <div className="text-center">
                    <p className="text-gray-400 text-sm sm:text-base">
                        Already have an account?{" "}
                        <Link
                            href={route("login")}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
