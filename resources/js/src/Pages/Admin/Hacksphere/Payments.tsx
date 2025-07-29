import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";

interface TeamMember {
    id: number;
    user_id: number; // Added user_id field for backend verification
    name: string;
    email: string;
    role: string;
    payment_status: string;
    payment_verified_at: string | null;
}

interface Team {
    id: number;
    team_name: string;
    team_code: string;
    leader_name: string;
    total_members: number;
    verified_payments: number;
    pending_payments: number;
    all_payments_verified: boolean;
    team_members: TeamMember[];
    created_at: string;
}

interface PaymentsProps {
    teams: Team[];
    total_teams: number;
}

const Payments: React.FC<PaymentsProps> = ({ teams, total_teams }) => {
    const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
    const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});

    const filteredTeams = teams.filter(team => {
        if (filter === 'verified') return team.all_payments_verified;
        if (filter === 'pending') return !team.all_payments_verified;
        return true;
    });

    const handleVerifyTeamPayment = async (teamId: number) => {
        const key = `team-${teamId}`;
        setProcessing(prev => ({ ...prev, [key]: true }));

        try {
            await router.post(`/admin/hacksphere/payments/verify-team/${teamId}`, {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Refresh the page to get updated data
                    router.reload({ only: ['teams'] });
                },
                onError: (errors) => {
                    console.error('Error verifying team payment:', errors);
                },
                onFinish: () => {
                    setProcessing(prev => ({ ...prev, [key]: false }));
                }
            });
        } catch (error) {
            console.error('Error verifying team payment:', error);
            setProcessing(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleRejectTeamPayment = async (teamId: number) => {
        const key = `team-${teamId}`;
        setProcessing(prev => ({ ...prev, [key]: true }));

        try {
            await router.post(`/admin/hacksphere/payments/reject-team/${teamId}`, {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['teams'] });
                },
                onError: (errors) => {
                    console.error('Error rejecting team payment:', errors);
                },
                onFinish: () => {
                    setProcessing(prev => ({ ...prev, [key]: false }));
                }
            });
        } catch (error) {
            console.error('Error rejecting team payment:', error);
            setProcessing(prev => ({ ...prev, [key]: false }));
        }
    };

    // Fungsi lama untuk backward compatibility
    const handleVerifyPayment = handleVerifyTeamPayment;
    const handleRejectPayment = handleRejectTeamPayment;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
            case 'paid': // Tambahkan case untuk nilai dari database
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                    </span>
                );
            case 'rejected':
            case 'failed': // Tambahkan case untuk nilai dari database
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
        <DashboardLayout>
            <Head title="Hacksphere - Payment Management" />
            
            <motion.div
                className="p-6"
                variants={containerVariant}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div className="mb-8" variants={itemVariant}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Hacksphere Payment Management
                    </h1>
                    <p className="text-gray-600">
                        Manage and verify team payment status for Hacksphere event
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariant}>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                                <p className="text-2xl font-bold text-gray-900">{total_teams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Fully Verified</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teams.filter(team => team.all_payments_verified).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teams.filter(team => !team.all_payments_verified).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Members</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teams.reduce((sum, team) => sum + team.total_members, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div className="mb-6" variants={itemVariant}>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All Teams ({teams.length})
                        </button>
                        <button
                            onClick={() => setFilter('verified')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'verified'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Fully Verified ({teams.filter(team => team.all_payments_verified).length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Pending ({teams.filter(team => !team.all_payments_verified).length})
                        </button>
                    </div>
                </motion.div>

                {/* Teams List */}
                <motion.div className="space-y-6" variants={itemVariant}>
                    {filteredTeams.map((team) => (
                        <div key={team.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            {/* Team Header */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {team.team_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Code: {team.team_code} | Leader: {team.leader_name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2">
                                            {team.all_payments_verified ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    All Verified
                                                </span>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        {team.pending_payments} Pending
                                                    </span>
                                                    <button
                                                        onClick={() => handleVerifyTeamPayment(team.id)}
                                                        disabled={processing[`team-${team.id}`]}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        {processing[`team-${team.id}`] ? 'Verifying...' : 'Verify Team'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectTeamPayment(team.id)}
                                                        disabled={processing[`team-${team.id}`]}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        {processing[`team-${team.id}`] ? 'Rejecting...' : 'Reject Team'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {team.verified_payments}/{team.total_members} verified
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="px-6 py-4">
                                <div className="space-y-3">
                                    {team.team_members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <h4 className="font-medium text-gray-900">
                                                        {member.name}
                                                    </h4>
                                                    {member.role === 'Leader' && (
                                                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                                            Leader
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{member.email}</p>
                                                {member.payment_verified_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Verified: {new Date(member.payment_verified_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                {getStatusBadge(member.payment_status)}
                                                {(member.payment_status === 'pending') && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            disabled={true}
                                                            className="px-3 py-1 bg-gray-400 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                        >
                                                            {processing[`${team.id}-${member.user_id}`] ? 'Verifying...' : 'Verify'}
                                                        </button>
                                                        <button
                                                            disabled={true}
                                                            className="px-3 py-1 bg-gray-400 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                        >
                                                            {processing[`${team.id}-${member.user_id}`] ? 'Rejecting...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                )}
                                                {(member.payment_status === 'rejected' || member.payment_status === 'failed') && (
                                                    <button
                                                        disabled={true}
                                                        className="px-3 py-1 bg-gray-400 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        {processing[`${team.id}-${member.user_id}`] ? 'Verifying...' : 'Verify'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {filteredTeams.length === 0 && (
                    <motion.div className="text-center py-12" variants={itemVariant}>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No teams match the current filter criteria.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </DashboardLayout>
    );
};

export default Payments;
