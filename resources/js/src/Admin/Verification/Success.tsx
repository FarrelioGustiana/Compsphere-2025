import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface TeamMember {
  name: string;
  email: string;
}

interface TeamData {
  leader: {
    name: string;
    email: string;
  };
  members: TeamMember[];
}

interface VerificationData {
  team_name?: string;
  team_code?: string;
  participant_name?: string;
  participant_email?: string;
  activity: string;
  verified_at: string;
  verified_by: string;
}

interface SuccessProps {
  title: string;
  message: string;
  verification: VerificationData;
  team?: TeamData;
  status: string;
}

export default function Success({ title, message, verification, team, status }: SuccessProps) {
  return (
    <DashboardLayout>
      <Head title="Verification Successful" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-center mb-6">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
              <p className="text-center mb-8">{message}</p>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                <h2 className="font-semibold text-lg mb-4">Verification Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verification.team_name && (
                    <div>
                      <p className="text-sm text-gray-500">Team Name</p>
                      <p className="font-medium">{verification.team_name}</p>
                    </div>
                  )}
                  
                  {verification.team_code && (
                    <div>
                      <p className="text-sm text-gray-500">Team Code</p>
                      <p className="font-medium">{verification.team_code}</p>
                    </div>
                  )}
                  
                  {verification.participant_name && (
                    <div>
                      <p className="text-sm text-gray-500">Participant Name</p>
                      <p className="font-medium">{verification.participant_name}</p>
                    </div>
                  )}
                  
                  {verification.participant_email && (
                    <div>
                      <p className="text-sm text-gray-500">Participant Email</p>
                      <p className="font-medium">{verification.participant_email}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Activity</p>
                    <p className="font-medium">{verification.activity}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Verified At</p>
                    <p className="font-medium">{verification.verified_at}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Verified By</p>
                    <p className="font-medium">{verification.verified_by}</p>
                  </div>
                </div>
              </div>
              
              {team && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h2 className="font-semibold text-lg mb-4">Team Members</h2>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Team Leader</h3>
                    <div className="pl-4 border-l-4 border-blue-300">
                      <p><strong>{team.leader.name}</strong></p>
                      <p className="text-sm text-gray-600">{team.leader.email}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">Team Members</h3>
                  <div className="space-y-3">
                    {team.members.map((member, index) => (
                      <div key={index} className="pl-4 border-l-4 border-gray-300">
                        <p><strong>{member.name}</strong></p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
