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
        first_name: "",
        last_name: "",
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
        post(route("register"));
    };

    return (
        <AuthLayout
            title="Join Compsphere 2025"
            subtitle="Create your account to be part of the innovation"
        >
            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="First Name"
                        name="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(value) => setData("first_name", value)}
                        error={errors.first_name}
                        placeholder="Enter your first name"
                        icon={<User className="w-5 h-5" />}
                        autoComplete="given-name"
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(value) => setData("last_name", value)}
                        error={errors.last_name}
                        placeholder="Enter your last name"
                        icon={<User className="w-5 h-5" />}
                        autoComplete="family-name"
                        required
                    />
                </div>
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
