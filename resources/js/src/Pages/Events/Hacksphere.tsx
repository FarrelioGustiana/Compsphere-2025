import React, { useState, useEffect } from "react";
import {
    User,
    Participant,
    Event,
    EventRegistration as EventRegistrationModel,
} from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import HacksphereRegistration from "@/src/Components/Hacksphere/HacksphereRegistration";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";

interface HacksphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
    eventRegistration?: EventRegistrationModel;
}

const Hacksphere: React.FC<HacksphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
    eventRegistration,
}) => {
    const [showNikForm, setShowNikForm] = useState(false);
    const [showHacksphereRegistration, setShowHacksphereRegistration] =
        useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nik: "",
    });

    console.log(eventRegistration);

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
                                <p className="mb-4">
                                    Thank you for registering for Hacksphere.
                                    We'll send you more details via email as the
                                    event approaches.
                                </p>

                                {/* Payment information for registered users */}
                                {eventRegistration &&
                                    eventRegistration.payment_status ===
                                        "pending" && (
                                        <div className="mt-4 bg-amber-800/30 border border-amber-600 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold mb-2">
                                                Payment Required
                                            </h4>
                                            <p className="mb-2">
                                                Your payment status is currently{" "}
                                                <span className="text-yellow-400 font-medium">
                                                    Pending Verification
                                                </span>
                                                . Please complete your payment
                                                of{" "}
                                                <span className="font-semibold">
                                                    IDR 150,000
                                                </span>{" "}
                                                and send proof via WhatsApp.
                                            </p>
                                            <p className="mb-1">
                                                <strong>Important:</strong> Each
                                                team member must pay IDR 150,000
                                                individually.
                                            </p>
                                            <p className="mb-4">
                                                Remember to include your name
                                                and team name in your payment
                                                proof message.
                                            </p>

                                            <a
                                                href="https://wa.me/6281234567890?text=Hello%2C%20I%20want%20to%20submit%20my%20payment%20proof%20for%20Hacksphere%20registration."
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                >
                                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                                </svg>
                                                Send Payment Proof via WhatsApp
                                            </a>
                                        </div>
                                    )}

                                {eventRegistration &&
                                    eventRegistration.payment_status ===
                                        "paid" && (
                                        <div className="mt-4 bg-green-800/30 border border-green-600 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold mb-2">
                                                Payment Complete
                                            </h4>
                                            <p>
                                                Your payment of{" "}
                                                <span className="font-semibold">
                                                    IDR 150,000
                                                </span>{" "}
                                                has been{" "}
                                                <span className="text-green-400 font-medium">
                                                    Verified
                                                </span>
                                                . Thank you for completing your
                                                registration!
                                            </p>
                                        </div>
                                    )}
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
