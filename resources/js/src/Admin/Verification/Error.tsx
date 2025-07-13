import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorProps {
  title: string;
  message: string;
  status: string;
}

export default function Error({ title, message, status }: ErrorProps) {
  return (
    <DashboardLayout>
      <Head title="Verification Error" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-center mb-6">
                <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
              <p className="text-center mb-8 text-red-600">{message}</p>
              
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                <h2 className="font-semibold text-lg mb-4">Verification Failed</h2>
                <p>
                  The QR code verification process could not be completed. This might be due to one of the following reasons:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>The QR code is invalid or has been tampered with</li>
                  <li>The team or participant is not registered for this activity</li>
                  <li>The activity doesn't exist or has been cancelled</li>
                  <li>There is a system error in the verification process</li>
                </ul>
              </div>
              
              <div className="flex justify-center mt-8">
                <Link 
                  href="/admin/dashboard" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
