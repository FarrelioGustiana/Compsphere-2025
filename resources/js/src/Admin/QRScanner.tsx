import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Event } from '@/types';
import Button from '@/src/Components/UI/Button';
import { QrScanner } from '@yudiel/react-qr-scanner';

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

// Custom Select components
const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) => (
  <select className="w-full p-2 border rounded" value={value} onChange={(e) => onValueChange(e.target.value)}>
    {children}
  </select>
);

const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>;
const SelectContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

// Custom Input component
const Input = ({ type, id, placeholder, value, onChange, className }: { 
  type: string, 
  id?: string, 
  placeholder?: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) => (
  <input 
    type={type}
    id={id} 
    className={`w-full p-2 border rounded ${className || ''}`}
    placeholder={placeholder} 
    value={value} 
    onChange={onChange}
  />
);

// Custom Label component
const Label = ({ htmlFor, children }: { htmlFor?: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">{children}</label>
);

// Custom Tabs components
const Tabs = ({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) => (
  <div className={`tabs-container ${className || ''}`}>{children}</div>
);

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex border-b mb-4 ${className || ''}`}>{children}</div>
);

const TabsTrigger = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <button 
    className={`px-4 py-2 text-gray-500 hover:text-blue-500`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => (
  <div className={`${className || ''}`}>{children}</div>
);

interface Props {
  events: Event[];
}

export default function QRScanner({ events }: Props) {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [manualUrl, setManualUrl] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string>('');
  
  const handleScan = (data: string) => {
    if (data) {
      // QR code detected, redirect to the URL
      window.location.href = data;
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scanner error:', err);
    setScanError('Error accessing camera: ' + err.message);
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl) {
      window.location.href = manualUrl;
    }
  };

  return (
    <DashboardLayout>
      <Head title="QR Code Scanner" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">
              QR Code Scanner
            </h1>
            
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">Scan with Camera</TabsTrigger>
                <TabsTrigger value="manual">Enter URL Manually</TabsTrigger>
              </TabsList>
              
              <TabsContent value="camera" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan QR Code</CardTitle>
                    <CardDescription>
                      Position the QR code in the camera view to scan.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="w-full">
                      <div className="mb-4">
                        <Label htmlFor="event">Filter by Event</Label>
                        <Select 
                          value={selectedEventId} 
                          onValueChange={setSelectedEventId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Events</SelectItem>
                            {events.map((event) => (
                              <SelectItem key={event.id} value={event.id.toString()}>
                                {event.event_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden">
                        {scanning ? (
                          <QrScanner
                            onDecode={handleScan}
                            onError={handleError}
                            constraints={{
                              facingMode: 'environment'
                            }}
                          />
                        ) : (
                          <div className="h-80 bg-gray-100 flex items-center justify-center">
                            <Button onClick={() => setScanning(true)}>
                              Start Scanner
                            </Button>
                          </div>
                        )}
                      </div>

                      {scanError && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                          {scanError}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {scanning && (
                      <Button 
                        variant="outline" 
                        onClick={() => setScanning(false)}
                        className="w-full"
                      >
                        Stop Scanner
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Verification URL</CardTitle>
                    <CardDescription>
                      If you have the verification URL, you can enter it directly.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleManualUrlSubmit}>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="url">Verification URL</Label>
                          <Input
                            type="text"
                            id="url"
                            placeholder="Enter the verification URL"
                            value={manualUrl}
                            onChange={(e) => setManualUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="mt-4 w-full">
                        Go to URL
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
