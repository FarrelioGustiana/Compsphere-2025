import React, { useState } from "react";
import { User, Participant } from "@/types/models";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import TeamInfoStep from "@/src/Components/Hacksphere/Steps/TeamInfoStep";
import TeamLeaderStep from "@/src/Components/Hacksphere/Steps/TeamLeaderStep";
import TeamMemberStep from "@/src/Components/Hacksphere/Steps/TeamMemberStep";
import SummaryStep from "@/src/Components/Hacksphere/Steps/SummaryStep";

interface HacksphereRegistrationProps {
    user?: User;
    participantDetails?: Participant | null;
    eventId: number;
}

const HacksphereRegistration: React.FC<HacksphereRegistrationProps> = ({
    user,
    participantDetails,
    eventId,
}) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [teamInfo, setTeamInfo] = useState({
        team_name: "",
    });
    const [leaderInfo, setLeaderInfo] = useState({
        team_leader_nik: participantDetails?.nik || "",
        team_leader_category: participantDetails?.category || "",
        team_leader_domicile: participantDetails?.domicile || "",
    });
    const [member1Info, setMember1Info] = useState({
        member1_email: "",
        member1_name: "",
        member1_nik: "",
        member1_category: "",
        member1_domicile: "",
        member1_user_id: 0,
    });
    const [member2Info, setMember2Info] = useState({
        member2_email: "",
        member2_name: "",
        member2_nik: "",
        member2_category: "",
        member2_domicile: "",
        member2_user_id: 0,
    });

    const { data, setData, post, processing, errors } = useForm({
        ...teamInfo,
        ...leaderInfo,
        ...member1Info,
        ...member2Info,
    });

    // Update form data when any step's data changes
    React.useEffect(() => {
        setData({
            ...teamInfo,
            ...leaderInfo,
            ...member1Info,
            ...member2Info,
        });
    }, [teamInfo, leaderInfo, member1Info, member2Info]);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const [submissionError, setSubmissionError] = useState<string>("");
    const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionError("");

        post(route("participant.register-hacksphere"), {
            onSuccess: () => {
                setSubmissionSuccess(true);
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);
                if (errors.default) {
                    setSubmissionError(errors.default);
                }
            },
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <TeamInfoStep
                        teamInfo={teamInfo}
                        setTeamInfo={setTeamInfo}
                        nextStep={nextStep}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <TeamLeaderStep
                        leaderInfo={leaderInfo}
                        setLeaderInfo={setLeaderInfo}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        user={user}
                    />
                );
            case 3:
                return (
                    <TeamMemberStep
                        memberInfo={member1Info}
                        setMemberInfo={setMember1Info}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        memberNumber={1}
                    />
                );
            case 4:
                return (
                    <TeamMemberStep
                        memberInfo={member2Info}
                        setMemberInfo={setMember2Info}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        memberNumber={2}
                    />
                );
            case 5:
                return (
                    <SummaryStep
                        teamInfo={teamInfo}
                        leaderInfo={leaderInfo}
                        member1Info={member1Info}
                        member2Info={member2Info}
                        prevStep={prevStep}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        user={user}
                        errors={errors}
                        submissionError={submissionError}
                        submissionSuccess={submissionSuccess}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-8 w-full max-w-2xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                        Hacksphere Team Registration
                    </h2>
                    <div className="flex justify-between items-center">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`flex flex-col items-center ${
                                    currentStep >= step
                                        ? "text-blue-400"
                                        : "text-gray-500"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                                        currentStep >= step
                                            ? "bg-blue-600"
                                            : "bg-gray-700"
                                    }`}
                                >
                                    {step}
                                </div>
                                <div className="text-xs">
                                    {step === 1 && "Team Info"}
                                    {step === 2 && "Leader"}
                                    {step === 3 && "Member 1"}
                                    {step === 4 && "Member 2"}
                                    {step === 5 && "Summary"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {renderStep()}
            </div>
        </div>
    );
};

export default HacksphereRegistration;
