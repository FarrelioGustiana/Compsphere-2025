import React, { useState } from "react";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import HacksphereRegistration from "@/src/Components/Hacksphere/HacksphereRegistration";
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
    const [showHacksphereRegistration, setShowHacksphereRegistration] =
        useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nik: "",
    });

    // Check if profile is complete but NIK is missing
    const isProfileCompleteButNikMissing =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth &&
        !participantDetails.nik;

    // Check if profile is complete with all required fields
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth;

    const handleNikSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("participant.update-nik"), {
            onSuccess: () => {
                setShowNikForm(false);
                setShowHacksphereRegistration(true);
            },
        });
    };

    const handleRegisterClick = () => {
        if (isProfileCompleteButNikMissing) {
            setShowNikForm(true);
        } else if (isProfileComplete) {
            // For Hacksphere, show the multi-step registration form
            setShowHacksphereRegistration(true);
        } else {
            // For other events, use the standard registration
            post(route("participant.register-event", event.id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="bg-gradient-to-r from-blue-800 to-purple-900 py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">Hacksphere</h1>
                    <p className="text-xl mb-6">
                        The premier hackathon for innovative solutions
                    </p>
                </div>
            </div>

            {showHacksphereRegistration ? (
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <div className="mb-6">
                        <button
                            onClick={() => setShowHacksphereRegistration(false)}
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Back to Event Details
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Hacksphere Team Registration
                        </h2>
                        <HacksphereRegistration
                            user={user}
                            participantDetails={participantDetails}
                            eventId={event.id}
                        />
                    </div>
                </div>
            ) : (
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">
                            About Hacksphere
                        </h2>
                        <p className="mb-4">
                            Hacksphere is a 48-hour hackathon where teams of 3
                            participants work together to build innovative
                            solutions to real-world problems. Join us for a
                            weekend of coding, creativity, and collaboration!
                        </p>
                        <p className="mb-4">
                            This event is open to high school students,
                            university students, and professionals. Form a team
                            and register now to secure your spot!
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">
                            Event Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Date & Time
                                </h3>
                                <p>August 15-17, 2025</p>
                                <p>Starts at 6:00 PM</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Location
                                </h3>
                                <p>Computer Science Building</p>
                                <p>University of Technology</p>
                                <p>Jakarta, Indonesia</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Prizes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-b from-yellow-500 to-yellow-700 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">
                                    1st Place
                                </h3>
                                <p className="text-2xl font-bold">
                                    Rp 10,000,000
                                </p>
                                <p>+ Internship opportunities</p>
                            </div>
                            <div className="bg-gradient-to-b from-gray-400 to-gray-600 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">
                                    2nd Place
                                </h3>
                                <p className="text-2xl font-bold">
                                    Rp 7,500,000
                                </p>
                                <p>+ Tech gadgets</p>
                            </div>
                            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">
                                    3rd Place
                                </h3>
                                <p className="text-2xl font-bold">
                                    Rp 5,000,000
                                </p>
                                <p>+ Software licenses</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">
                            Registration
                        </h2>
                        {isRegistered ? (
                            <div className="bg-green-800/30 border border-green-700 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    You're Registered!
                                </h3>
                                <p>
                                    Thank you for registering for Hacksphere.
                                    We'll send you more details via email as the
                                    event approaches.
                                </p>
                            </div>
                        ) : showNikForm ? (
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Complete Your Profile
                                </h3>
                                <p className="mb-4">
                                    Please provide your NIK (National Identity
                                    Number) to complete your registration.
                                </p>
                                <form onSubmit={handleNikSubmit}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="nik"
                                            className="block text-sm font-medium text-gray-300 mb-1"
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
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            maxLength={16}
                                            minLength={16}
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
                                            onClick={() =>
                                                setShowNikForm(false)
                                            }
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
                                                : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <EventRegistration
                                event={event}
                                user={user}
                                participantDetails={participantDetails}
                                onRegisterClick={handleRegisterClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hacksphere;
