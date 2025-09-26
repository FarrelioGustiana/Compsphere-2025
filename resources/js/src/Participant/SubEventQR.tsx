import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { SubEvent, EventRegistration, User } from '@/types/models';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Calendar, MapPin } from 'lucide-react';

interface SubEventQRProps {
    subEvent: SubEvent & {
        event: {
            id: number;
            event_name: string;
            event_code: string;
        };
    };
    registration: EventRegistration;
    qrData: {
        verification_url: string;
        verification_token: string;
        status: string;
    };
    user: User;
}

export default function SubEventQR({ subEvent, registration, qrData, user }: SubEventQRProps) {
    const downloadQRCode = () => {
        const svg = document.getElementById('qr-code-canvas') as unknown as SVGElement;
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            canvas.width = 200;
            canvas.height = 200;
            
            img.onload = () => {
                ctx?.drawImage(img, 0, 0);
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${subEvent.sub_event_name}-QR-${user.first_name}_${user.last_name}.png`;
                link.href = url;
                link.click();
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            <Head title={`QR Code - ${subEvent.sub_event_name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            {subEvent.sub_event_name} QR Code
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Your entry pass for {subEvent.event.event_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* QR Code Section */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-white mb-6">Your QR Code</h2>
                                
                                <div className="bg-white p-6 rounded-lg inline-block mb-6">
                                    <QRCodeSVG
                                        id="qr-code-canvas"
                                        value={qrData.verification_url}
                                        size={200}
                                        level="M"
                                        includeMargin={true}
                                    />
                                </div>

                                <button
                                    onClick={downloadQRCode}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download QR Code
                                </button>

                                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-yellow-300 text-sm">
                                        <strong>Important:</strong> Show this QR code to event staff for verification. 
                                        Each QR code can only be used once.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Event Details Section */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-300 text-sm">Date & Time</p>
                                        <p className="text-white font-medium">
                                            {formatDateTime(subEvent.start_time)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-red-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-300 text-sm">Location</p>
                                        <p className="text-white font-medium">{subEvent.location}</p>
                                    </div>
                                </div>

                                {subEvent.description && (
                                    <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                                        <p className="text-gray-300 text-sm">{subEvent.description}</p>
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
