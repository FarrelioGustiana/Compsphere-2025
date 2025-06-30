import React from 'react';
import { usePage, router } from '@inertiajs/react';

interface User {
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

const Dashboard: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { user } = props.auth;

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
                <p className="text-lg text-gray-400 mb-6">Your email is {user.email}</p>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
