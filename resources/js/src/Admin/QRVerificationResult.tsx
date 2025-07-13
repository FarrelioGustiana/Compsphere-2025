import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Event, Activity } from '@/types';
import Button from '@/src/Components/UI/Button';
// Membuat komponen card yang belum ada
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Implementasi komponen Card sebagai pengganti yang tidak ditemukan
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

interface VerificationData {
  verification: {
    id: number;
    team_id: number;
    activity_id: number;
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
    name: string;
    code: string;
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
}

export default function QRVerificationResult({ success, message, data, event, activity, verification }: Props) {
  return (
    <DashboardLayout>
      <Head title={success ? "Verification Successful" : "Verification Failed"} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">
              Verification Result
            </h1>
            
            <Card className={success 
              ? "border-2 border-green-200" 
              : "border-2 border-red-200"
            }>
              <CardHeader className={success ? "bg-green-50" : "bg-red-50"}>
                <CardTitle className="flex items-center">
                  {success ? (
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5 text-red-600" />
                  )}
                  {success ? "Verification Successful" : "Verification Failed"}
                </CardTitle>
                <CardDescription>
                  {message}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {data && (
                  <div className="space-y-4">
                    {data.team && (
                      <div>
                        <h3 className="text-lg font-medium">Team</h3>
                        <p className="text-gray-600">{data.team.name} ({data.team.code})</p>
                      </div>
                    )}
                    
                    {data.activity && (
                      <div>
                        <h3 className="text-lg font-medium">Activity</h3>
                        <p className="text-gray-600">{data.activity.name} ({data.activity.code})</p>
                      </div>
                    )}
                    
                    {data.event && (
                      <div>
                        <h3 className="text-lg font-medium">Event</h3>
                        <p className="text-gray-600">{data.event.name} ({data.event.code})</p>
                      </div>
                    )}

                    {data.verification && (
                      <div>
                        <h3 className="text-lg font-medium">Verification Status</h3>
                        <p className="text-gray-600">
                          {data.verification.status === 'used' ? 'Verified' : data.verification.status.charAt(0).toUpperCase() + data.verification.status.slice(1)}
                        </p>
                      </div>
                    )}
                    
                    {data.verification && data.verification.verified_at && (
                      <div>
                        <h3 className="text-lg font-medium">Verified At</h3>
                        <p className="text-gray-600">{new Date(data.verification.verified_at).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {data.admin && (
                      <div>
                        <h3 className="text-lg font-medium">Verified By</h3>
                        <p className="text-gray-600">{data.admin.name}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* For cases where the event and activity are provided separately */}
                {!data && event && activity && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Event</h3>
                      <p className="text-gray-600">{event.event_name} ({event.event_code})</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Activity</h3>
                      <p className="text-gray-600">{activity.name} ({activity.activity_code})</p>
                    </div>
                    
                    {verification && (
                      <div>
                        <h3 className="text-lg font-medium">Verification Status</h3>
                        <p className="text-gray-600">
                          {verification.status === 'used' ? 'Verified' : verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {!success && !data && !event && !activity && (
                  <div className="flex items-center justify-center p-6">
                    <AlertCircle className="mr-2 h-6 w-6 text-red-500" />
                    <p>No verification details available.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center pt-6">
                <Link href="/admin/qr/scanner">
                  <Button>
                    Back to Scanner
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
