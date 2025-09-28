import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Button from "@/src/Components/UI/Button";
import { CheckCircle, User, Calendar, Mail, Phone } from "lucide-react";

interface Props {
  event: any;
  subEvent?: any;
  eventRegistration: any;
  participant: any;
  user: any;
  verificationToken: string;
  error?: string;
}

export default function EventRegistrationVerificationConfirm({
  event,
  subEvent,
  eventRegistration,
  participant,
  user,
  verificationToken,
  error,
}: Props) {
  // Debug logging
  console.log('Verification Confirm Props:', {
    participant,
    user,
    eventRegistration
  });
  const { post, processing } = useForm({
    verification_token: verificationToken,
  });

  const handleVerify = () => {
    post("/admin/verify-registration", {
      onSuccess: () => {
        // Success will be handled by the redirect to result page
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Head title="Verify Event Registration" />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Event Registration</h1>
          <p className="text-gray-400">
            Confirm the participant details before marking as verified
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Event Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Event:</span>
              <p className="font-medium">{event.event_name}</p>
            </div>
            <div>
              <span className="text-gray-400">Event Code:</span>
              <p className="font-medium uppercase">{event.event_code}</p>
            </div>
            {subEvent && (
              <>
                <div>
                  <span className="text-gray-400">Sub-Event:</span>
                  <p className="font-medium text-yellow-400">{subEvent.sub_event_name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Sub-Event Time:</span>
                  <p className="font-medium">
                    {new Date(subEvent.start_time).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="font-medium">{subEvent.location}</p>
                </div>
              </>
            )}
            <div>
              <span className="text-gray-400">Registration Date:</span>
              <p className="font-medium">
                {new Date(eventRegistration.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Registration Status:</span>
              <p className="font-medium capitalize">{eventRegistration.registration_status}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Participant Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-gray-400 text-sm">Full Name:</span>
                <p className="font-medium">{user ? `${user.first_name} ${user.last_name}` : (participant.full_name || '')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-gray-400 text-sm">Email:</span>
                <p className="font-medium">{user && user.email ? user.email : (participant && participant.email ? participant.email : '')}</p>
              </div>
            </div>
            
            {participant.phone_number && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Phone:</span>
                  <p className="font-medium">{participant.phone_number}</p>
                </div>
              </div>
            )}
            
            {participant.category && (
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-900 font-bold">C</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Category:</span>
                  <p className="font-medium capitalize">{participant.category}</p>
                </div>
              </div>
            )}
            
            {participant.date_of_birth && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Date of Birth:</span>
                  <p className="font-medium">
                    {new Date(participant.date_of_birth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
            
            {participant.domicile && (
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-900 font-bold">L</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Domicile:</span>
                  <p className="font-medium">{participant.domicile}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-red-300 mb-2">❌ Verification Error</h3>
            <p className="text-red-200 text-sm">
              {error}
            </p>
          </div>
        )}

        <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Important</h3>
          <p className="text-yellow-200 text-sm">
            Once you verify this registration, the QR code will be marked as used and cannot be used again. 
            Please ensure all participant information is correct before proceeding.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <Button
            onClick={handleVerify}
            disabled={processing || !!error}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Verifying..." : error ? "Cannot Verify" : "Verify Registration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
