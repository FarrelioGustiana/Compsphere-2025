import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Event, EventRegistration } from "@/types/models";
import { Download, Users } from "lucide-react";
import ParticipantTable from "@/src/Admin/Components/ParticipantTable";

interface EventParticipantsProps {
    event: Event;
    registrations: EventRegistration[];
    user?: any; // Admin authentication context
}

export default function EventParticipants({
    event,
    registrations,
}: EventParticipantsProps) {
    // Generate CSV data for export
    const handleExportCSV = () => {
        // Create CSV header
        const headers = [
            "Name",
            "Email",
            "Phone",
            "Institution",
            "Domicile",
            "Registration Status",
            event.is_paid_event ? "Payment Status" : "",
            "Registration Date",
        ].join(",");

        // Create CSV rows
        const csvRows = registrations.map((registration) => {
            const userData = registration.participant?.user;
            const participantData = registration.participant;

            return [
                userData?.full_name || "N/A",
                userData?.email || "N/A",
                participantData?.phone_number || "N/A",
                participantData?.job_or_institution || "N/A",
                participantData?.domicile || "N/A",
                registration.registration_status || "N/A",
                event.is_paid_event ? registration.payment_status : "N/A",
                new Date(registration.registration_date).toLocaleDateString(
                    "en-US"
                ),
            ].join(",");
        });

        // Combine header and rows
        const csvContent = [headers, ...csvRows].join("\n");

        // Create and trigger download
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `${event.event_code}-participants-${
                new Date().toISOString().split("T")[0]
            }.csv`
        );
        link.click();
    };

    return (
        <DashboardLayout>
            <Head title={`${event.event_name} Participants`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        {event.event_name} Participants
                    </h1>
                    
                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Registrations</p>
                                    <p className="text-3xl font-bold">{registrations.length}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-200" />
                            </div>
                        </div>

                        {event.is_paid_event && (
                            <div className="bg-green-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Paid Participants</p>
                                        <p className="text-3xl font-bold">
                                            {registrations.filter((reg) => reg.payment_status === "paid").length}
                                        </p>
                                    </div>
                                    <Users className="h-12 w-12 text-green-200" />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Participants Table */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">Participant List</h2>
                            <button
                                onClick={handleExportCSV}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </button>
                        </div>

                        <div className="p-6">
                            {event.is_paid_event && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                                        Paid: {registrations.filter((reg) => reg.payment_status === "paid").length}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                        Pending Payment: {registrations.filter((reg) => reg.payment_status === "pending").length}
                                    </span>
                                </div>
                            )}

                            <ParticipantTable
                                registrations={registrations}
                                event={event}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
