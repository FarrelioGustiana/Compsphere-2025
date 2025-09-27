import React from 'react';
import { Head } from '@inertiajs/react';
import { Event, Activity } from '@/types';
import { CheckCircle, XCircle, Calendar, User, Mail } from 'lucide-react';

interface VerificationData {
  verification: {
    id: number;
    team_id?: number;
    activity_id?: number;
    verification_token: string;
    status: 'active' | 'used' | 'expired';
    verified_at: string | null;
    verified_by: number | null;
  };
  team?: {
    id: number;
    name: string;
    code: string;
  };
  activity?: {
    id: number;
    name: string;
    code: string;
  };
  event?: {
    id: number;
    event_name: string;
    event_code: string;
  };
  event_registration?: {
    id: number;
    registration_status: string;
    created_at: string;
  };
  participant?: {
    id: number;
    full_name: string;
    email: string;
    phone_number?: string;
    category?: string;
    date_of_birth?: string;
    domicile?: string;
  };
  user?: {
    id: number;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
  admin?: {
    id: number;
    name: string;
  };
}

interface Props {
  success: boolean;
  message: string;
  data?: VerificationData | null;
  event?: Event;
  activity?: Activity;
  verification?: any;
  type?: string;
}

export default function QRVerificationResult({ success, message, data, event, activity, verification, type }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title={success ? "Verification Successful" : "Verification Failed"} />
      
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Verification Result</h1>
          
          <div className={`rounded-lg p-6 mb-6 ${
            success 
              ? 'bg-green-900/50 border border-green-700' 
              : 'bg-red-900/50 border border-red-700'
          }`}>
            <div className="flex items-center justify-center mb-4">
              {success ? (
                <CheckCircle className="h-12 w-12 text-green-400" />
              ) : (
                <XCircle className="h-12 w-12 text-red-400" />
              )}
            </div>
            
            <h2 className={`text-xl font-semibold text-center mb-2 ${
              success ? 'text-green-300' : 'text-red-300'
            }`}>
              {success ? "Verification Successful" : "Verification Failed"}
            </h2>
            
            <p className="text-center text-gray-300 text-sm">
              {success ? "Event registration successfully verified" : message}
            </p>
          </div>

          {/* Event Information */}
          {(data?.event || event) && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Event</h3>
              <p className="text-white font-medium">
                {data?.event?.event_name || event?.event_name || 'Unknown Event'}
              </p>
            </div>
          )}

          {/* Verification Status */}
          {data?.verification && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Verification Status</h3>
              <p className="text-white font-medium capitalize">
                {data.verification.status === 'used' ? 'Verified' : data.verification.status}
              </p>
            </div>
          )}

          {/* Verified At */}
          {data?.verification?.verified_at && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Verified At</h3>
              <p className="text-white font-medium">
                {formatDate(data.verification.verified_at)}
              </p>
            </div>
          )}

          {/* Verified By */}
          {data?.admin && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Verified By</h3>
              <p className="text-white font-medium">{data.admin.name}</p>
            </div>
          )}

          {/* Participant Information (for event registrations) */}
          {data?.participant && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-green-400 mb-3">Participant Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-xs">Full Name:</span>
                    <p className="text-white font-medium">{data.user ? `${data.user.first_name} ${data.user.last_name}` : (data.participant?.full_name || '')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-xs">Email:</span>
                    <p className="text-white font-medium">{data.user ? data.user.email : (data.participant?.email || '')}</p>
                  </div>
                </div>
                
                {data.participant.phone_number && (
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-900 font-bold">P</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Phone:</span>
                      <p className="text-white font-medium">{data.participant.phone_number}</p>
                    </div>
                  </div>
                )}
                
                {data.participant.category && (
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-900 font-bold">C</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Category:</span>
                      <p className="text-white font-medium capitalize">{data.participant.category}</p>
                    </div>
                  </div>
                )}
                
                {data.participant.date_of_birth && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-gray-400 text-xs">Date of Birth:</span>
                      <p className="text-white font-medium">
                        {new Date(data.participant.date_of_birth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team and Activity Information (for team activities) */}
          {data?.team && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Team</h3>
              <p className="text-white font-medium">{data.team.name} ({data.team.code})</p>
            </div>
          )}

          {data?.activity && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-300 mb-2">Activity</h3>
              <p className="text-white font-medium">{data.activity.name} ({data.activity.code})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
