import React from "react";
import { User } from "@/types/models";
import { Shield, Award, Calendar, Mail } from "lucide-react";

interface RecentUsersListProps {
    title: string;
    users: User[];
    type: 'admin' | 'judge';
}

export default function RecentUsersList({ title, users, type }: RecentUsersListProps) {
    const getIcon = () => {
        return type === 'admin' ? Shield : Award;
    };

    const getColorClasses = () => {
        return type === 'admin' 
            ? "text-blue-400 bg-blue-500" 
            : "text-purple-400 bg-purple-500";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const Icon = getIcon();
    const colorClasses = getColorClasses();

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]} mr-3`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-8">
                    <Icon className={`h-12 w-12 mx-auto ${colorClasses.split(' ')[0]} opacity-50`} />
                    <p className="text-gray-400 mt-2">No {type}s created yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <img
                                        src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=6b7280&color=ffffff`}
                                        alt={user.full_name}
                                        className="h-10 w-10 rounded-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-200">
                                        {user.full_name}
                                    </h4>
                                    <div className="flex items-center text-xs text-gray-400 space-x-3">
                                        <div className="flex items-center">
                                            <Mail className="h-3 w-3 mr-1" />
                                            {user.email}
                                        </div>
                                        {type === 'admin' && user.adminProfile && (
                                            <div className="flex items-center">
                                                <Shield className="h-3 w-3 mr-1" />
                                                {user.adminProfile.admin_level === 'super_admin' ? 'Super Admin' : 'Moderator'}
                                            </div>
                                        )}
                                        {type === 'judge' && user.judgeProfile && (
                                            <div className="flex items-center">
                                                <Award className="h-3 w-3 mr-1" />
                                                {user.judgeProfile.full_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {user.created_at && formatDate(user.created_at)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {users.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-500 text-center">
                        Showing {users.length} most recent {type}s
                    </p>
                </div>
            )}
        </div>
    );
}
