import React, { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { route } from "ziggy-js";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

export default function VerifyEmail() {
    // Get user email from Inertia page props
    const { auth, status } = usePage().props as any;
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
                {status && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-400 bg-green-400/10 px-4 py-2 rounded-lg text-sm font-medium w-full text-center"
                    >
                        {status}
                    </motion.div>
                )}
                
                {resent && !error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-blue-400 bg-blue-400/10 px-4 py-2 rounded-lg text-sm font-medium w-full text-center"
                    >
                        Verification email has been sent again! Please check your inbox.
                    </motion.div>
                )}
                
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
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg text-sm font-medium w-full text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </AuthLayout>
    );
}
