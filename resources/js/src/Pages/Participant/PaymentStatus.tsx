import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    payment_status: string;
    payment_verified_at: string | null;
}

interface PaymentStatusProps {
    team: {
        id: number;
        team_name: string;
        team_code: string;
        created_at: string;
    };
    event: {
        id: number;
        name: string;
        code: string;
    };
    team_members: TeamMember[];
    all_payments_verified: boolean;
    payment_amount: number;
    whatsapp_number: string;
    is_leader: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
    team,
    event,
    team_members,
    all_payments_verified,
    payment_amount,
    whatsapp_number,
    is_leader,
}) => {
    const whatsappMessage = encodeURIComponent(
        `Hi, I would like to send payment proof for Hacksphere registration.\n\nTeam: ${team.team_name}\nTeam Code: ${team.team_code}\nMember Name: [Your Name Here]`
    );
    const whatsappLink = `https://wa.me/${whatsapp_number}?text=${whatsappMessage}`;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
            case 'paid':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                    </span>
                );
            case 'rejected':
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                    </span>
                );
        }
    };

    const containerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 100 },
        },
    };

    return (
        <>
            <Head title={`Payment Status - ${team.team_name}`} />
            
            <div 
                className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url('/assets/hacksphere/bg-hacksphere.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "bottom center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "scroll"
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                
                <motion.div
                    className="relative z-10 max-w-4xl mx-auto"
                    variants={containerVariant}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div className="text-center mb-8" variants={itemVariant}>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                            Payment Status
                        </h1>
                        <p className="text-gray-300">
                            Team: <span className="text-white font-semibold">{team.team_name}</span> ({team.team_code})
                        </p>
                    </motion.div>

                    {/* Status Overview */}
                    <motion.div
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-xl border border-blue-500/30 mb-8"
                        variants={itemVariant}
                    >
                        {all_payments_verified ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-400 mb-2">All Payments Verified!</h3>
                                <p className="text-gray-300 mb-4">
                                    Your team can now access all Hacksphere features.
                                </p>
                                <Link
                                    href={`/participant/team/${team.id}`}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                                >
                                    Go to Team Dashboard
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-2">Payment Verification Required</h3>
                                <p className="text-gray-300">
                                    Some team members still need to verify their payments before accessing Hacksphere features.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Payment Instructions */}
                    <motion.div
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-xl border border-blue-500/30 mb-8"
                        variants={itemVariant}
                    >
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Payment Instructions</h3>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                                    1
                                </div>
                                <p className="text-gray-300">
                                    One team must pay <span className="text-white font-semibold">IDR {payment_amount.toLocaleString()}</span> for the entire team (Not Individually)
                                </p>
                            </div>
                            <div className="flex items-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                                    2
                                </div>
                                <p className="text-gray-300">
                                    Send payment proof via WhatsApp using the button below
                                </p>
                            </div>
                            <div className="flex items-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                                    3
                                </div>
                                <p className="text-gray-300">
                                    Wait for admin verification (usually within 24 hours)
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Send Payment Proof via WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    {/* Team Members Payment Status */}
                    <motion.div
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-xl border border-blue-500/30"
                        variants={itemVariant}
                    >
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Team Members Payment Status</h3>
                        <div className="space-y-4">
                            {team_members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <div>
                                        <h4 className="font-semibold text-white">
                                            {member.name}
                                            {member.role === 'Leader' && (
                                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                                    Leader
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-400">{member.email}</p>
                                        {member.payment_verified_at && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Verified: {new Date(member.payment_verified_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        {getStatusBadge(member.payment_status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Back to Dashboard */}
                    <motion.div className="text-center mt-8" variants={itemVariant}>
                        <Link
                            href="/participant/dashboard"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default PaymentStatus;
