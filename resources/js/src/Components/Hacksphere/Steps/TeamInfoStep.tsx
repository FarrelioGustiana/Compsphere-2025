import React from 'react';

interface TeamInfoStepProps {
    teamInfo: {
        team_name: string;
    };
    setTeamInfo: React.Dispatch<React.SetStateAction<{
        team_name: string;
    }>>;
    nextStep: () => void;
    errors: any;
}

const TeamInfoStep: React.FC<TeamInfoStepProps> = ({ 
    teamInfo, 
    setTeamInfo, 
    nextStep, 
    errors 
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeamInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (teamInfo.team_name.trim() !== '') {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Step 1: Team Information</h3>
                <p className="text-gray-300 mb-4">
                    Please provide information about your Hacksphere team.
                </p>

                <div className="mb-4">
                    <label htmlFor="team_name" className="block text-sm font-medium text-gray-300 mb-1">
                        Team Name
                    </label>
                    <input
                        id="team_name"
                        name="team_name"
                        type="text"
                        value={teamInfo.team_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.team_name && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.team_name}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default TeamInfoStep;
