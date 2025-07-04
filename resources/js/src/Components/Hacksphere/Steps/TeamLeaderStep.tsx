import React from 'react';
import { User } from '@/types/models';

interface TeamLeaderStepProps {
    leaderInfo: {
        team_leader_nik: string;
        team_leader_category: string;
        team_leader_domicile: string;
    };
    setLeaderInfo: React.Dispatch<React.SetStateAction<{
        team_leader_nik: string;
        team_leader_category: string;
        team_leader_domicile: string;
    }>>;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
    user?: User;
}

const TeamLeaderStep: React.FC<TeamLeaderStepProps> = ({ 
    leaderInfo, 
    setLeaderInfo, 
    nextStep, 
    prevStep, 
    errors,
    user 
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLeaderInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            leaderInfo.team_leader_nik.trim() !== '' && 
            leaderInfo.team_leader_category !== '' &&
            leaderInfo.team_leader_domicile.trim() !== ''
        ) {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Step 2: Team Leader Information</h3>
                <p className="text-gray-300 mb-4">
                    As the team leader, please provide your information below.
                </p>
                
                <div className="mb-4 p-3 bg-blue-900/30 rounded border border-blue-700">
                    <p className="text-sm text-blue-300">
                        <strong>Note:</strong> You ({user?.first_name} {user?.last_name}) will be registered as the team leader.
                    </p>
                </div>

                <div className="mb-4">
                    <label htmlFor="team_leader_nik" className="block text-sm font-medium text-gray-300 mb-1">
                        NIK (National Identity Number)
                    </label>
                    <input
                        id="team_leader_nik"
                        name="team_leader_nik"
                        type="text"
                        value={leaderInfo.team_leader_nik}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={16}
                        minLength={16}
                    />
                    {errors.team_leader_nik && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.team_leader_nik}
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Enter your 16-digit NIK without spaces</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="team_leader_category" className="block text-sm font-medium text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        id="team_leader_category"
                        name="team_leader_category"
                        value={leaderInfo.team_leader_category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="high_school">High School</option>
                        <option value="university">University</option>
                        <option value="non_academic">Non-Academic</option>
                    </select>
                    {errors.team_leader_category && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.team_leader_category}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="team_leader_domicile" className="block text-sm font-medium text-gray-300 mb-1">
                        Domicile (City/Region)
                    </label>
                    <input
                        id="team_leader_domicile"
                        name="team_leader_domicile"
                        type="text"
                        value={leaderInfo.team_leader_domicile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.team_leader_domicile && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.team_leader_domicile}
                        </div>
                    )}
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default TeamLeaderStep;
