import React from 'react';

interface ActivityVerification {
  id: number;
  activity_id: number;
  activity_name: string;
  activity_description: string;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  qr_code_url: string;
  verification_token: string;
}

interface QrCodeDisplayProps {
  activityVerifications: ActivityVerification[];
  teamName: string;
}

export default function QrCodeDisplay({ activityVerifications, teamName }: QrCodeDisplayProps) {
  return (
    <div className="mt-6 bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">Your Hacksphere QR Codes</h3>
      <p className="text-gray-400 mb-4">
        These QR codes will be used for verification during the Hacksphere event. 
        Please have these ready when requested by event staff.
      </p>
      
      {activityVerifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activityVerifications.map((verification) => (
            <div 
              key={verification.id} 
              className={`rounded-lg overflow-hidden border ${verification.is_verified ? 'border-green-500 bg-gray-700' : 'border-gray-600 bg-gray-700'}`}
            >
              <div className="p-4">
                <div className="text-lg font-medium text-gray-200 mb-2">
                  {verification.activity_description}
                </div>
                
                <div className="flex justify-center my-3">
                  {verification.is_verified ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-green-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-300 text-center">Verified at {verification.verified_at}</p>
                    </div>
                  ) : (
                    <div className="bg-white p-2 rounded-md">
                      <img 
                        src={verification.qr_code_url} 
                        alt={`QR Code for ${verification.activity_description}`}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Status:</span> {verification.is_verified ? 'Verified' : 'Not Verified'}
                  </p>
                  
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Team:</span> {teamName}
                  </p>
                  
                  {verification.verified_at && (
                    <p className="text-sm text-gray-400">
                      <span className="font-medium">Verified at:</span> {verification.verified_at}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-300 text-center">No activity verifications found for your team.</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-gray-700 border border-yellow-600 rounded-md">
        <p className="text-sm text-yellow-400">
          <span className="font-bold">Important:</span> Each QR code can only be used once. Please do not share these QR codes with anyone outside your team.
        </p>
      </div>
    </div>
  );
}
