import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "../Components/Layout/DashboardLayout";
import { User } from "@/types/models";
import EventCard from "../Components/Participant/EventCard";

interface Event {
    name: string;
    description: string;
    registered: boolean;
}

interface ParticipantDashboardProps {
    user: User;
    participantDetails: any;
    events: Event[];
}

export default function Dashboard({ user, participantDetails, events }: ParticipantDashboardProps) {
    return (
        <DashboardLayout>
            <Head title="Participant Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">Welcome, {user.first_name + " " + user.last_name}!</h1>
                    <p className="mt-1 text-gray-400">
                        This is your participant dashboard for Compsphere 2025.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Available Events</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <EventCard
                                key={index}
                                name={event.name}
                                description={event.description}
                                registered={event.registered}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Profile</h2>
                    
                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Personal Information</h3>
                                <p className="text-gray-400">
                                    <span className="font-medium">Name:</span> {user.first_name + " " + user.last_name}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-medium">Email:</span> {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
