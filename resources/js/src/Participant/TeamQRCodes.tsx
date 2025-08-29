import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Team, Event, Activity, TeamActivityVerification } from '@/types';
import Button from '@/src/Components/UI/Button';
import { AlertTriangle, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

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

// Custom Alert components
const Alert = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 ${className || ''}`}>{children}</div>
);

const AlertTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h4 className={`text-md font-medium ${className || ''}`}>{children}</h4>
);

const AlertDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm mt-1 ${className || ''}`}>{children}</p>
);

interface QRCodeData {
  activity: Activity;
  verification: TeamActivityVerification;
  verification_url: string;
}

interface Props {
  team: Team;
  event: Event;
  qrCodesData: QRCodeData[];
}

export default function TeamQRCodes({ team, event, qrCodesData }: Props) {
  const [regeneratingActivity, setRegeneratingActivity] = useState<number | null>(null);

  const handleRegenerateQRCode = (activityId: number) => {
    setRegeneratingActivity(activityId);
    
    router.post('/participant/team/qr-codes/regenerate', {
      team_id: team.id,
      activity_id: activityId,
    }, {
      onSuccess: () => {
        setRegeneratingActivity(null);
      },
      onError: () => {
        setRegeneratingActivity(null);
      },
      preserveScroll: true
    });
  };

  // Create a function to download QR code as an image
  const downloadQRCode = (activityId: number, verificationUrl: string) => {
    // Get the QR code canvas
    const canvas = document.getElementById(`qr-code-${activityId}`) as HTMLCanvasElement;
    if (!canvas) return;
    
    // Convert canvas to image data URL
    const imageData = canvas.toDataURL('image/png');
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = imageData;
    downloadLink.download = `qrcode_${team.team_code}_${activityId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <DashboardLayout>
      <Head title="Team QR Codes" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">
              {team.team_name} - QR Codes
            </h1>
            
            <div className="mb-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important!</AlertTitle>
                <AlertDescription>
                  These QR codes are for your team's activities in {event.event_name}. Each QR code corresponds to a specific activity.
                  Show these QR codes to event staff for verification. QR codes can only be used once.
                </AlertDescription>
              </Alert>
            </div>
            
            {qrCodesData.length === 0 && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                <h4 className="text-md font-medium">No QR Codes Available</h4>
                <p className="text-sm mt-1">
                  No QR codes have been generated for your team's activities. Please contact the administrator.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodesData.map((qrData) => (
                <Card key={qrData.activity.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{qrData.activity.name}</CardTitle>
                    <CardDescription>{qrData.activity.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <div className="qr-code-container border p-3 rounded-lg">
                        <QRCodeCanvas 
                          id={`qr-code-${qrData.activity.id}`}
                          value={qrData.verification_url}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Activity Code: <span className="font-mono">{qrData.activity.activity_code}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => downloadQRCode(qrData.activity.id, qrData.verification_url)}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <Link href={`/participant/team/${team.id}`}>
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
