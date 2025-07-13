import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Event, Activity } from '@/types';
import Button from '@/src/Components/UI/Button';
import { CheckCircle, XCircle } from 'lucide-react';

// Custom UI components to replace missing components
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-white shadow-md rounded-lg ${className || ''}`}>{children}</div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 border-b ${className || ''}`}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`text-lg font-semibold ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm text-gray-500 ${className || ''}`}>{children}</p>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 ${className || ''}`}>{children}</div>
);

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 bg-gray-50 ${className || ''}`}>{children}</div>
);

interface Props {
  event: Event;
  activity: Activity;
  verificationToken: string;
}

export default function QRVerificationConfirm({ event, activity, verificationToken }: Props) {
  const [processing, setProcessing] = useState(false);

  // Handle verification confirmation
  const handleVerify = () => {
    setProcessing(true);
    
    router.post('/admin/qr-verification/verify', {
      verification_token: verificationToken
    }, {
      onError: () => {
        setProcessing(false);
      }
    });
  };
  
  // Handle verification cancellation
  const handleCancel = () => {
    // Return to the scanner page
    window.location.href = '/admin/qr/scanner';
  };

  return (
    <DashboardLayout>
      <Head title="Confirm QR Verification" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">
              Confirm Verification
            </h1>
            
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle>Verify Activity Participation</CardTitle>
                <CardDescription>
                  Please confirm that you want to verify this team's participation in the activity.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Event</h3>
                    <p className="text-gray-600">{event.event_name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Activity</h3>
                    <p className="text-gray-600">{activity.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Activity Description</h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Verification Token</h3>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {verificationToken}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                    <p className="font-medium">Important Notice</p>
                    <p className="text-sm">
                      This QR code can only be verified once. After verification, it will be 
                      marked as used and cannot be used again.
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={processing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleVerify}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Verification
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
