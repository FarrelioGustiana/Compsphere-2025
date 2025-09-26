import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { ArrowLeft, Download } from 'lucide-react';

interface SubEventDetailProps {
    subEvent: {
        id: number;
        sub_event_name: string;
        location: string;
    };
    registrations: Array<{
        id: number;
        registration_date: string;
        verification_status: string;
        user: {
            first_name: string;
            last_name: string;
            email: string;
            participant: {
                category: string;
                phone_number: string;
            } | null;
        };
    }>;
}

export default function SubEventDetail({ subEvent, registrations }: SubEventDetailProps) {
    // Debug logging
    console.log('SubEventDetail received data:', { subEvent, registrations });
    registrations.forEach((reg, index) => {
        console.log(`Registration ${index}:`, {
            id: reg.id,
            user: reg.user,
            participant: reg.user.participant
        });
    });

    return (
        <DashboardLayout>
            <Head title={`${subEvent.sub_event_name} - Participants`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/talksphere" className="px-4 py-2 bg-gray-700 text-white rounded-lg">
                            <ArrowLeft className="h-4 w-4 inline mr-2" />
                            Back
                        </Link>
                        <h1 className="text-3xl font-bold text-white">{subEvent.sub_event_name}</h1>
                        <Link href={`/admin/talksphere/sub-event/${subEvent.id}/export`} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                            <Download className="h-4 w-4 inline mr-2" />
                            Export
                        </Link>
                    </div>

                    <div className="bg-gray-800 rounded-xl border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">Participants ({registrations.length})</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {registrations.map((registration) => (
                                        <tr key={registration.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 text-white">
                                                {registration.user.first_name} {registration.user.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{registration.user.email}</td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {registration.user.participant?.phone_number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {registration.user.participant?.category || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    registration.verification_status === 'verified' 
                                                        ? 'bg-green-500/20 text-green-300' 
                                                        : registration.verification_status === 'pending_verification'
                                                        ? 'bg-yellow-500/20 text-yellow-300'
                                                        : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {registration.verification_status === 'verified' ? 'Verified' :
                                                     registration.verification_status === 'pending_verification' ? 'Pending Verification' :
                                                     'Not Verified'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
