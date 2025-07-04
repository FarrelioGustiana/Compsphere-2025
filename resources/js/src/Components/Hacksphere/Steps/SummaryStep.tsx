import React from "react";
import { User } from "@/types/models";

interface SummaryStepProps {
    teamInfo: {
        team_name: string;
    };
    leaderInfo: {
        team_leader_nik: string;
        team_leader_category: string;
        team_leader_domicile: string;
    };
    member1Info: {
        member1_email: string;
        member1_name: string;
        member1_nik: string;
        member1_category: string;
        member1_domicile: string;
    };
    member2Info: {
        member2_email: string;
        member2_name: string;
        member2_nik: string;
        member2_category: string;
        member2_domicile: string;
    };
    prevStep: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    user?: User;
    errors?: Record<string, string>;
    submissionError?: string;
    submissionSuccess?: boolean;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
    teamInfo,
    leaderInfo,
    member1Info,
    member2Info,
    prevStep,
    handleSubmit,
    processing,
    user,
    errors,
    submissionError,
    submissionSuccess,
}) => {
    const formatCategory = (category: string) => {
        switch (category) {
            case "high_school":
                return "High School";
            case "university":
                return "University";
            case "non_academic":
                return "Non-Academic";
            default:
                return category;
        }
    };

    console.log(member1Info, member2Info);

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    Step 5: Summary
                </h3>
                <p className="text-gray-300 mb-4">
                    Please review your team information before submitting.
                </p>

                <div className="mb-6 bg-gray-700 p-4 rounded">
                    <h4 className="text-md font-semibold text-white mb-2">
                        Team Information
                    </h4>
                    <p className="text-gray-300">
                        <span className="font-medium">Team Name:</span>{" "}
                        {teamInfo.team_name}
                    </p>
                </div>

                <div className="mb-6 bg-gray-700 p-4 rounded">
                    <h4 className="text-md font-semibold text-white mb-2">
                        Team Leader
                    </h4>
                    <p className="text-gray-300">
                        <span className="font-medium">Name:</span>{" "}
                        {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Email:</span>{" "}
                        {user?.email}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">NIK:</span>{" "}
                        {leaderInfo.team_leader_nik}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Category:</span>{" "}
                        {formatCategory(leaderInfo.team_leader_category)}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Domicile:</span>{" "}
                        {leaderInfo.team_leader_domicile}
                    </p>
                </div>

                <div className="mb-6 bg-gray-700 p-4 rounded">
                    <h4 className="text-md font-semibold text-white mb-2">
                        Team Member 1
                    </h4>
                    <p className="text-gray-300">
                        <span className="font-medium">Name:</span>{" "}
                        {member1Info.member1_name}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Email:</span>{" "}
                        {member1Info.member1_email}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">NIK:</span>{" "}
                        {member1Info.member1_nik}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Category:</span>{" "}
                        {formatCategory(member1Info.member1_category)}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Domicile:</span>{" "}
                        {member1Info.member1_domicile}
                    </p>
                </div>

                <div className="mb-6 bg-gray-700 p-4 rounded">
                    <h4 className="text-md font-semibold text-white mb-2">
                        Team Member 2
                    </h4>
                    <p className="text-gray-300">
                        <span className="font-medium">Name:</span>{" "}
                        {member2Info.member2_name}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Email:</span>{" "}
                        {member2Info.member2_email}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">NIK:</span>{" "}
                        {member2Info.member2_nik}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Category:</span>{" "}
                        {formatCategory(member2Info.member2_category)}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-medium">Domicile:</span>{" "}
                        {member2Info.member2_domicile}
                    </p>
                </div>

                {/* Display form errors if any */}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="p-3 bg-red-900/30 rounded border border-red-700 mb-4">
                        <p className="text-sm text-red-300 font-bold mb-2">
                            Please fix the following errors:
                        </p>
                        <ul className="list-disc pl-5">
                            {Object.entries(errors).map(([key, error]) => (
                                <li key={key} className="text-sm text-red-300">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Display submission error if any */}
                {submissionError && (
                    <div className="p-3 bg-red-900/30 rounded border border-red-700 mb-4">
                        <p className="text-sm text-red-300">
                            <strong>Error:</strong> {submissionError}
                        </p>
                    </div>
                )}

                {/* Display success message if submission was successful */}
                {submissionSuccess && (
                    <div className="p-3 bg-green-900/30 rounded border border-green-700 mb-4">
                        <p className="text-sm text-green-300">
                            <strong>Success!</strong> Your team has been
                            successfully registered for Hacksphere!
                        </p>
                    </div>
                )}

                <div className="p-3 bg-yellow-900/30 rounded border border-yellow-700 mb-4">
                    <p className="text-sm text-yellow-300">
                        <strong>Important:</strong> By submitting this form, you
                        confirm that all information provided is accurate and
                        that all team members have agreed to participate in
                        Hacksphere.
                    </p>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    disabled={processing || submissionSuccess}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {processing
                        ? "Submitting..."
                        : submissionSuccess
                        ? "Registration Complete"
                        : "Submit Registration"}
                </button>
            </div>
        </form>
    );
};

export default SummaryStep;
