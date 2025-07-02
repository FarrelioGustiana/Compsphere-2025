import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { route } from 'ziggy-js';

interface EventVerificationProps {
  user: any;
  event: any;
  qrCode: string;
  verificationUrl: string;
}

export default function EventVerification({ user, event, qrCode, verificationUrl }: EventVerificationProps) {
  return (
    <DashboardLayout>

      <Head title="Event Verification" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6 lg:p-8 border-b border-gray-700">
              <h1 className="text-2xl font-medium text-gray-200">
                {event.event_name} - Verification QR Code
              </h1>
              <p className="mt-6 text-gray-400 leading-relaxed">
                Please present this QR code when you arrive at the event for verification.
              </p>

              <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Verification URL: {verificationUrl}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    This QR code is unique to you and this event. Do not share it with others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
