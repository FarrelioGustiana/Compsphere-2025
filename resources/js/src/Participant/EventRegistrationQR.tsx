import React from "react";
import { Head } from "@inertiajs/react";
import { QRCodeCanvas } from "qrcode.react";
import Button from "@/src/Components/UI/Button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Link, router } from "@inertiajs/react";

interface QRCodeData {
  verification_id: number;
  event_registration_id: number;
  event_id: number;
  event_name: string;
  event_code: string;
  user_id: number;
  user_name: string;
  verification_token: string;
  verification_url: string;
  status: string;
}

interface Props {
  event: any;
  eventRegistration: any;
  qrCodeData: QRCodeData;
}

export default function EventRegistrationQR({ event, eventRegistration, qrCodeData }: Props) {
  const handleRegenerateQRCode = () => {
    router.post('/participant/event-registration/qr-code/regenerate', {
      event_code: event.event_code,
    });
  };

  // Create a function to download QR code as an image
  const downloadQRCode = (verificationUrl: string) => {
    // Get the QR code canvas
    const canvas = document.getElementById(`qr-code-${qrCodeData.verification_id}`) as HTMLCanvasElement;
    if (canvas) {
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `qrcode_${event.event_code}_${qrCodeData.user_name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Head title={`${event.event_name} - Registration QR Code`} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {event.event_name} - Registration QR Code
            </h1>
            <p className="text-gray-400">
              Your registration verification QR code
            </p>
          </div>
          <Link
            href="/participant/dashboard"
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6">
          <div className={`border p-4 rounded-lg ${
            qrCodeData.status === 'verified' 
              ? 'bg-green-900/50 border-green-700' 
              : 'bg-blue-900/50 border-blue-700'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              qrCodeData.status === 'verified' ? 'text-green-300' : 'text-blue-300'
            }`}>
              {qrCodeData.status === 'verified' ? '✅ Registration Verified' : 'Important Instructions'}
            </h3>
            <p className={`text-sm ${
              qrCodeData.status === 'verified' ? 'text-green-200' : 'text-blue-200'
            }`}>
              {qrCodeData.status === 'verified' 
                ? 'Your registration has been successfully verified! You are now registered for this event. Keep this QR code for your records.' 
                : 'Present this QR code to event staff on the day of the event for check-in verification. The QR code can only be used once and will be marked as used after verification.'}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{event.event_name}</h2>
              <p className="text-gray-400 mt-1">
                Registration QR Code for {qrCodeData.user_name}
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* QR Code Display */}
                <div className="flex-1">
                  <div className="qr-code-container border border-gray-600 p-6 rounded-lg bg-white flex justify-center">
                    <QRCodeCanvas
                      id={`qr-code-${qrCodeData.verification_id}`}
                      value={qrCodeData.verification_url}
                      size={256}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => downloadQRCode(qrCodeData.verification_url)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                    
                    <button
                      onClick={handleRegenerateQRCode}
                      disabled={qrCodeData.status === 'verified'}
                      className={`flex-1 border px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
                        qrCodeData.status === 'verified'
                          ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {qrCodeData.status === 'verified' ? 'Verified' : 'Regenerate'}
                    </button>
                  </div>
                </div>

                {/* Event Information */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Event:</span>
                        <span className="text-white">{event.event_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participant:</span>
                        <span className="text-white">{qrCodeData.user_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registration Date:</span>
                        <span className="text-white">
                          {new Date(eventRegistration.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          qrCodeData.status === 'active' 
                            ? 'bg-green-900 text-green-300' 
                            : qrCodeData.status === 'verified'
                            ? 'bg-blue-900 text-blue-300'
                            : qrCodeData.status === 'used'
                            ? 'bg-gray-900 text-gray-300'
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {qrCodeData.status === 'verified' ? 'VERIFIED' : qrCodeData.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <h4 className="font-medium mb-2 text-white">Verification URL</h4>
                    <div className="bg-gray-700 p-3 rounded text-xs font-mono break-all text-gray-300">
                      {qrCodeData.verification_url}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Keep this QR code safe and present it during event check-in. 
              If you encounter any issues, please contact event support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
