import React from "react";
import { Link } from "@inertiajs/react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

interface EventCardProps {
    name: string;
    description: string;
    registered: boolean;
}

export default function EventCard({
    name,
    description,
    registered,
}: EventCardProps) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-gray-750">
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">
                        {name}
                    </h3>
                </div>

                <p className="text-gray-400 mb-4">{description}</p>

                <div className="flex items-center text-gray-400 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Registration deadline: July 15, 2025</span>
                </div>

                <div className="mt-4">
                    {registered ? (
                        <Link
                            href="#"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Details
                        </Link>
                    ) : (
                        <Link
                            href="#"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Register Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
