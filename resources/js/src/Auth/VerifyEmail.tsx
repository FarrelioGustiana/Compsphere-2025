import React, { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

export default function VerifyEmail() {
    // Get user email from Inertia page props
    const { auth } = usePage().props as any;
    const userEmail = auth?.user?.email || "your email";

    const [cooldown, setCooldown] = useState(30);
    const [resent, setResent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResend = async () => {
        setLoading(true);
        setError("");
        router.post(
            route("verification.send"),
            {},
            {
                onSuccess: () => {
                    setResent(true);
                    setCooldown(30);
                },
                onError: (errors) => {
                    setError(
                        "Failed to resend verification email. Please try again."
                    );
                },
                onFinish: () => setLoading(false),
                preserveScroll: true,
            }
        );
    };

    const handleAlreadyVerified = () => {
        // Reload the page or fetch user info
        window.location.reload();
    };

    return (
        <AuthLayout
            title="Verify your account!"
            subtitle="Check your email inbox for a verification link sent to:"
        >
            <div className="space-y-6 flex flex-col items-center">
                <div className="text-lg text-white font-semibold text-center">
                    {userEmail}
                </div>

                <Button
                    type="button"
                    variant="gradient"
                    size="lg"
                    disabled={cooldown > 0 || loading}
                    loading={loading}
                    onClick={handleResend}
                    className="w-full"
                >
                    {cooldown > 0
                        ? `Resend email in ${cooldown}s`
                        : resent
                        ? "Resent! Check your inbox"
                        : "Resend verification email"}
                </Button>

                <div className="text-center mt-2">
                    <button
                        onClick={handleAlreadyVerified}
                        className="text-blue-400 underline hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                        Already verified my account.
                    </button>
                </div>
                {error && (
                    <div className="text-red-400 text-sm mt-2">{error}</div>
                )}
            </div>
        </AuthLayout>
    );
}
