import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Users, Calendar, Eye, Download } from 'lucide-react';

interface SubEventData {
    id: number;
    sub_event_name: string;
    total_registrations: number;
    start_time: string;
    location: string;
}

interface TalksphereDashboardProps {
    subEvents: SubEventData[];
    statistics: {
        total_registrations: number;
        total_unique_participants: number;
    };
}

export default function TalksphereDashboard({ subEvents, statistics }: TalksphereDashboardProps) {
    return (
        <DashboardLayout>
            <Head title="Talksphere Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white mb-8">Talksphere Dashboard</h1>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Registrations</p>
                                    <p className="text-3xl font-bold">{statistics.total_registrations}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-200" />
                            </div>
                        </div>

                        <div className="bg-green-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Unique Participants</p>
                                    <p className="text-3xl font-bold">{statistics.total_unique_participants}</p>
                                </div>
                                <Users className="h-12 w-12 text-green-200" />
                            </div>
                        </div>
                    </div>

                    {/* Sub-Events */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">Sub-Events</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {subEvents.map((subEvent) => (
                                    <div key={subEvent.id} className="bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {subEvent.sub_event_name}
                                        </h3>
                                        
                                        <div className="text-gray-300 text-sm mb-4">
                                            <p>📅 {new Date(subEvent.start_time).toLocaleDateString()}</p>
                                            <p>📍 {subEvent.location}</p>
                                            <p>👥 {subEvent.total_registrations} registrations</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/talksphere/sub-event/${subEvent.id}`}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/talksphere/sub-event/${subEvent.id}/export`}
                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
