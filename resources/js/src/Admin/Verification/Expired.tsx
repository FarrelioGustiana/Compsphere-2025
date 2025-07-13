import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { ClockIcon } from '@heroicons/react/24/outline';

interface VerificationData {
  team_name?: string;
  participant_name?: string;
  activity: string;
  verified_at: string;
  verified_by: string;
}

interface ExpiredProps {
  title: string;
  message: string;
  verification: VerificationData;
  status: string;
}

export default function Expired({ title, message, verification, status }: ExpiredProps) {
  return (
    <DashboardLayout>
      <Head title="QR Code Expired" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-center mb-6">
                <ClockIcon className="h-16 w-16 text-amber-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
              <p className="text-center mb-8 text-amber-600">{message}</p>
              
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
                <h2 className="font-semibold text-lg mb-4">Previous Verification Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verification.team_name && (
                    <div>
                      <p className="text-sm text-gray-500">Team Name</p>
                      <p className="font-medium">{verification.team_name}</p>
                    </div>
                  )}
                  
                  {verification.participant_name && (
                    <div>
                      <p className="text-sm text-gray-500">Participant Name</p>
                      <p className="font-medium">{verification.participant_name}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Activity</p>
                    <p className="font-medium">{verification.activity}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Previously Verified At</p>
                    <p className="font-medium">{verification.verified_at}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Verified By</p>
                    <p className="font-medium">{verification.verified_by}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 mb-6">
                <h2 className="font-semibold text-lg mb-4">Important Information</h2>
                <p>
                  This QR code has already been used and cannot be verified again. Each QR code is designed for one-time use only to prevent duplicate verifications.
                </p>
                <div className="mt-4 p-3 bg-white border rounded-md">
                  <p className="text-sm font-medium text-gray-600">If you believe this is an error or need to re-verify for a legitimate reason, please contact the event coordinator.</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Link 
                  href="/admin/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
