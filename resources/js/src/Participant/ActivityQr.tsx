import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { User } from '@/types/models';
import { CheckCircle, Clock, ArrowLeft, Download } from 'lucide-react';
import Button from '@/src/Components/UI/Button';
import QRCode, { QRCodeCanvas } from 'qrcode.react';

// Custom UI components
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-gray-800 shadow-md rounded-lg ${className || ''}`}>{children}</div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 border-b border-gray-700 ${className || ''}`}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`text-lg font-semibold text-white ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm text-gray-400 ${className || ''}`}>{children}</p>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 ${className || ''}`}>{children}</div>
);

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`px-6 py-4 bg-gray-700 rounded-b-lg ${className || ''}`}>{children}</div>
);

interface ActivityQrProps {
  team: {
    id: number;
    name: string;
    code: string;
  };
  activity: {
    id: number;
    name: string;
    description: string;
    code: string;
    verified: boolean;
    verification_time: string | null;
  };
  qrData: {
    verification_id: number;
    team_id: number;
    team_name: string;
    activity_id: number;
    activity_name: string;
    verification_token: string;
    verification_url: string;
    status: string;
  };
  auth: {
    user: User;
  };
}

export default function ActivityQr({ team, activity, qrData, auth }: ActivityQrProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  // Generate QR code when component mounts
  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      setQrCodeDataUrl(canvas.toDataURL('image/png'));
    }
  }, [qrData]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not verified yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle QR code download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${team.name}-${activity.name}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <Head title={`${activity.name} - QR Code`} />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/participant/team/${team.id}`}>
              <Button variant="secondary" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Activity QR Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{activity.name}</CardTitle>
                  <CardDescription>
                    Team: {team.name} | Code: {activity.code}
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  activity.verified 
                    ? 'bg-green-800 text-green-200' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {activity.verified ? 'Verified' : 'Pending'}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <p className="text-gray-300 text-center mb-4">{activity.description}</p>
                  
                  <div className="flex items-center justify-center mb-2">
                    {activity.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm text-gray-300">
                      {activity.verified 
                        ? `Verified on ${formatDate(activity.verification_time)}` 
                        : 'Waiting for verification'}
                    </span>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg mb-6">
                  <div className="hidden">
                    <QRCodeCanvas
                      id="qr-canvas"
                      value={qrData.verification_url}
                      size={300}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt={`QR Code for ${activity.name}`} 
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Loading QR code...</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    Show this QR code to the event staff to verify your participation in this activity.
                  </p>
                  
                  <Button 
                    onClick={handleDownload}
                    className="flex items-center"
                    disabled={!qrCodeDataUrl}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-sm text-gray-400">
                {activity.verified 
                  ? 'This activity has been verified and will count towards your team progress.' 
                  : 'This activity is pending verification. Once verified, it will count towards your team progress.'}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
