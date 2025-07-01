import React from "react";
import { useForm } from "@inertiajs/react";

interface ProfileFormProps {
    participantDetails?: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ participantDetails }) => {
    const { data, setData, post, processing, errors } = useForm({
        category: participantDetails?.category || "",
        phone_number: participantDetails?.phone_number || "",
        job_or_institution: participantDetails?.job_or_institution || "",
        date_of_birth: participantDetails?.date_of_birth || "",
        domicile: participantDetails?.domicile || "",
    });

    const isFilled = !!(
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth &&
        participantDetails.domicile
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFilled) {
            post("/participant/profile/update");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Category</label>
                <select
                    name="category"
                    value={data.category}
                    onChange={(e) => setData("category", e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                    required
                    disabled={isFilled || processing}
                >
                    <option value="">Select category</option>
                    <option value="high_school">Mahasiswa</option>
                    <option value="university">Umum</option>
                    <option value="non_academic">Non-Akademik</option>
                </select>
                {errors.category && (
                    <div className="text-red-400 text-xs mt-1">
                        {errors.category}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                    type="text"
                    name="phone_number"
                    value={data.phone_number}
                    onChange={(e) => setData("phone_number", e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                    required
                    disabled={isFilled || processing}
                />
                {errors.phone_number && (
                    <div className="text-red-400 text-xs mt-1">
                        {errors.phone_number}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">
                    Job or Institution
                </label>
                <input
                    type="text"
                    name="job_or_institution"
                    value={data.job_or_institution}
                    onChange={(e) =>
                        setData("job_or_institution", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                    disabled={isFilled || processing}
                />
                {errors.job_or_institution && (
                    <div className="text-red-400 text-xs mt-1">
                        {errors.job_or_institution}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">
                    Date of Birth
                </label>
                <input
                    type="date"
                    name="date_of_birth"
                    value={data.date_of_birth}
                    onChange={(e) => setData("date_of_birth", e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                    required
                    disabled={isFilled || processing}
                />
                {errors.date_of_birth && (
                    <div className="text-red-400 text-xs mt-1">
                        {errors.date_of_birth}
                    </div>
                )}
            </div>
            <div className="mb-6">
                <label className="block text-gray-300 mb-1">Domicile</label>
                <input
                    type="text"
                    name="domicile"
                    value={data.domicile}
                    onChange={(e) => setData("domicile", e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none"
                    required
                    disabled={isFilled || processing}
                />
                {errors.domicile && (
                    <div className="text-red-400 text-xs mt-1">
                        {errors.domicile}
                    </div>
                )}
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50"
                disabled={isFilled || processing}
            >
                Save Profile
            </button>
        </form>
    );
};

export default ProfileForm;
