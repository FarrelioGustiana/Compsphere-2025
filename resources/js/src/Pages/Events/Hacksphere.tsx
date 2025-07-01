import React, { useState } from "react";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

interface HacksphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
}

const Hacksphere: React.FC<HacksphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
}) => {
    const [showNikForm, setShowNikForm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nik: "",
    });

    // Check if profile is complete but NIK is missing
    const isProfileCompleteButNikMissing =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth &&
        participantDetails.domicile &&
        !participantDetails.nik;

    const handleNikSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("participant.update-nik"));
    };

    const handleRegisterClick = () => {
        if (isProfileCompleteButNikMissing) {
            setShowNikForm(true);
        } else {
            post(route("participant.register-event", event.id));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Hacksphere</h1>
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
            ) : showNikForm ? (
                <div className="mt-8 w-full max-w-md">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">
                            NIK Required for Hacksphere
                        </h3>
                        <p className="mb-4">
                            Please provide your NIK (National Identity Number)
                            to register for Hacksphere.
                        </p>

                        <form onSubmit={handleNikSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="nik"
                                    className="block text-sm font-medium mb-1"
                                >
                                    NIK
                                </label>
                                <input
                                    id="nik"
                                    type="text"
                                    value={data.nik}
                                    onChange={(e) =>
                                        setData("nik", e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                                    required
                                />
                                {errors.nik && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.nik}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowNikForm(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit NIK"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="mt-8 text-center">
                    {isProfileCompleteButNikMissing ? (
                        <button
                            onClick={handleRegisterClick}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Register for Hacksphere (NIK required)
                        </button>
                    ) : (
                        <EventRegistration
                            eventId={event.id}
                            eventName={event.event_name}
                            user={user}
                            participantDetails={participantDetails}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Hacksphere;
