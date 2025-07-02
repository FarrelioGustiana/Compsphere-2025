import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import axios from 'axios';
import { route } from 'ziggy-js';

interface EventVerificationProps {
  event: any;
  participant: any;
  eventRegistration: any;
}

export default function EventVerification({ event, participant, eventRegistration }: EventVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(!!eventRegistration.attendance_verified_at);
  const [error, setError] = useState('');

  const handleVerifyAttendance = async () => {
    setIsVerifying(true);
    setError('');
    
    try {
      const response = await axios.post(
        route('admin.event.verify-attendance', {
          eventCode: event.event_code,
          verificationCode: eventRegistration.verification_code
        })
      );
      
      if (response.data.success) {
        setIsVerified(true);
      } else {
        setError('Failed to verify attendance. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while verifying attendance.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout>

      <Head title="Verify Event Attendance" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6 lg:p-8 border-b border-gray-700">
              <h1 className="text-2xl font-medium text-gray-200">
                {event.event_name} - Attendance Verification
              </h1>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Participant Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{participant.first_name} {participant.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{participant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registration Status</p>
                    <p className="mt-1 text-sm text-gray-900">{eventRegistration.registration_status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registration Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(eventRegistration.registration_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Attendance Verification</h2>
                
                {isVerified ? (
                  <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-300">
                          Attendance has been verified
                          {eventRegistration.attendance_verified_at && (
                            <span> on {new Date(eventRegistration.attendance_verified_at).toLocaleString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    {error && (
                      <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-300">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleVerifyAttendance}
                      disabled={isVerifying}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Attendance'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
