import React from "react";
import { useForm } from "@inertiajs/react";
import { User, Participant } from "@/types/models";
import { route } from "ziggy-js";

interface EventRegistrationProps {
    eventId: number;
    eventName: string;
    user?: User;
    participantDetails?: Participant | null;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
    eventId,
    eventName,
    user,
    participantDetails,
}) => {
    const { post, processing } = useForm({});

    const handleRegister = () => {
        post(route("participant.register-event", eventId));
    };

    // Check if user is logged in
    if (!user) {
        return (
            <div className="mt-8 text-center">
                <p className="mb-4">
                    Please log in to register for this event.
                </p>
                <a
                    href={route("login")}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Log In
                </a>
            </div>
        );
    }

    // Check if user is a participant
    if (user.role !== "participant") {
        return (
            <div className="mt-8 text-center">
                <p className="text-amber-300">
                    Only participants can register for events.
                </p>
            </div>
        );
    }

    // Check if participant profile is complete
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth &&
        participantDetails.domicile;

    if (!isProfileComplete) {
        return (
            <div className="mt-8 text-center">
                <p className="mb-4 text-amber-300">
                    Please complete your profile before registering.
                </p>
                <a
                    href={route("participant.profile")}
                    className="inline-block px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                    Complete Profile
                </a>
            </div>
        );
    }

    return (
        <div className="mt-8 text-center">
            <button
                onClick={handleRegister}
                disabled={processing}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? "Registering..." : `Register for ${eventName}`}
            </button>
        </div>
    );
};

export default EventRegistration;
