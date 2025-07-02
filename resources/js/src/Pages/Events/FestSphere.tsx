import React from "react";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";

interface FestsphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
}

const Festsphere: React.FC<FestsphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Festsphere</h1>
            <p className="max-w-xl text-lg text-center mb-8">
                {event.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <span className="bg-white/20 rounded px-4 py-2 text-sm">
                    Start: {new Date(event.start_date).toLocaleDateString()}
                </span>
                <span className="bg-white/20 rounded px-4 py-2 text-sm">
                    End: {new Date(event.end_date).toLocaleDateString()}
                </span>
                <span className="bg-white/20 rounded px-4 py-2 text-sm">
                    Location: {event.location}
                </span>
            </div>

            {isRegistered ? (
                <div className="mt-8 text-center">
                    <div className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg">
                        You are registered for this event!
                    </div>
                </div>
            ) : (
                <EventRegistration
                    eventId={event.id}
                    eventName={event.event_name}
                    user={user}
                    participantDetails={participantDetails}
                />
            )}
        </div>
    );
};

export default Festsphere;
