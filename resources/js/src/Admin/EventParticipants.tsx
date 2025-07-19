import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Event, EventRegistration } from "@/types/models";
import { Download } from "lucide-react";
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

    console.log(event);

    return (
        <DashboardLayout>
            <Head title={`${event.event_name} Participants`} />

            <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {event.event_name} Participants
                    </h1>

                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4">
                        <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Total: {registrations.length} participant
                                {registrations.length !== 1 && "s"}
                            </span>

                            {event.is_paid_event && (
                                <div className="mt-2 flex space-x-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Paid:{" "}
                                        {
                                            registrations.filter(
                                                (reg) =>
                                                    reg.payment_status ===
                                                    "paid"
                                            ).length
                                        }
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending Payment:{" "}
                                        {
                                            registrations.filter(
                                                (reg) =>
                                                    reg.payment_status ===
                                                    "pending"
                                            ).length
                                        }
                                    </span>
                                </div>
                            )}
                        </div>

                        <ParticipantTable
                            registrations={registrations}
                            event={event}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
