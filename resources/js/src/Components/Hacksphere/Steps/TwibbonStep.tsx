import React from "react";

interface TwibbonStepProps {
    twibbonInfo: {
        twibbon_leader_link: string;
        twibbon_member1_link: string;
        twibbon_member2_link: string;
    };
    setTwibbonInfo: React.Dispatch<
        React.SetStateAction<{
            twibbon_leader_link: string;
            twibbon_member1_link: string;
            twibbon_member2_link: string;
        }>
    >;
    leaderName: string;
    member1Name: string;
    member2Name: string;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
}

const TwibbonStep: React.FC<TwibbonStepProps> = ({
    twibbonInfo,
    setTwibbonInfo,
    leaderName,
    member1Name,
    member2Name,
    nextStep,
    prevStep,
    errors,
}) => {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setTwibbonInfo({
            ...twibbonInfo,
            [field]: e.target.value,
        });
    };

    const validateUrls = () => {
        // Basic URL validation - check if links are provided
        // More stringent validation can be added if needed
        const leaderLinkValid = twibbonInfo.twibbon_leader_link.trim() !== '';
        const member1LinkValid = twibbonInfo.twibbon_member1_link.trim() !== '';
        const member2LinkValid = twibbonInfo.twibbon_member2_link.trim() !== '';

        return leaderLinkValid && member1LinkValid && member2LinkValid;
    };

    const handleContinue = () => {
        if (validateUrls()) {
            nextStep();
        }
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl text-white font-bold mb-4">
                Post Your Twibbon
            </h3>
            
            <div className="mb-6">
                <p className="text-gray-300 mb-4">
                    As part of the Hacksphere registration, each team member must post our event Twibbon on Instagram and provide the link below.
                </p>
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">
                        How to Use the Twibbon:
                    </h4>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2 pl-2">
                        <li>Download our Hacksphere Twibbon <a href="#" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">here</a></li>
                        <li>Apply the Twibbon to your photo using any photo editing app</li>
                        <li>Post it on your Instagram with hashtag #Hacksphere2025</li>
                        <li>Make sure your profile is public (at least until the event)</li>
                        <li>Copy the post URL and paste it in the form below</li>
                    </ol>
                </div>
            </div>

            <div className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Team Leader: {leaderName}
                    </label>
                    <input
                        type="url"
                        value={twibbonInfo.twibbon_leader_link}
                        onChange={(e) => handleInputChange(e, "twibbon_leader_link")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.instagram.com/p/..."
                        required
                    />
                    {errors.twibbon_leader_link && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.twibbon_leader_link}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Team Member 1: {member1Name}
                    </label>
                    <input
                        type="url"
                        value={twibbonInfo.twibbon_member1_link}
                        onChange={(e) => handleInputChange(e, "twibbon_member1_link")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.instagram.com/p/..."
                        required
                    />
                    {errors.twibbon_member1_link && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.twibbon_member1_link}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Team Member 2: {member2Name}
                    </label>
                    <input
                        type="url"
                        value={twibbonInfo.twibbon_member2_link}
                        onChange={(e) => handleInputChange(e, "twibbon_member2_link")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.instagram.com/p/..."
                        required
                    />
                    {errors.twibbon_member2_link && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.twibbon_member2_link}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default TwibbonStep;
