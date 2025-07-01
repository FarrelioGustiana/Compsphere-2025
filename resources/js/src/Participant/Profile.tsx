import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User } from "@/types/models";
import ProfileForm from "./ProfileForm";

interface ParticipantProfileProps {
    user: User;
    participantDetails: any;
}

export default function Profile({
    user,
    participantDetails,
}: ParticipantProfileProps) {
    return (
        <DashboardLayout>
            <Head title="Participant Profile" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Your Profile
                    </h1>
                    <p className="mt-1 text-gray-400">
                        View your personal information.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-200">
                                Personal Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-400">
                                Your personal details and contact information.
                            </p>
                        </div>
                        <div className="border-t border-gray-700">
                            <dl>
                                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        {user.first_name} {user.last_name}
                                    </dd>
                                </div>
                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        {user.email}
                                    </dd>
                                </div>
                                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Role
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2 capitalize">
                                        {user.role}
                                    </dd>
                                </div>
                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Email verification
                                    </dt>
                                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                                        {user.email_verified ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Not Verified
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Participant Profile Form */}
                <div className="max-w-2xl mx-auto mt-10 bg-gray-800 rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Participant Profile
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Please complete your participant profile before
                        registering for events.
                    </p>
                    {/* Only show the form if profile is not completed */}
                    {(!participantDetails || !participantDetails.category || !participantDetails.phone_number || !participantDetails.job_or_institution || !participantDetails.date_of_birth || !participantDetails.domicile) ? (
                        <ProfileForm participantDetails={participantDetails} />
                    ) : (
                        <div className="bg-green-900 border-l-4 border-green-500 text-green-200 p-4 rounded text-center">
                            <div className="font-semibold mb-1">Profile Completed</div>
                            <div>Your participant profile has already been filled and cannot be changed.</div>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
}
