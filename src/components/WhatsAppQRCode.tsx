import React, { useState, useEffect } from 'react';
import { QrCode, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface WhatsAppQRCodeProps {
  onVerified?: () => void;
}

const WhatsAppQRCode: React.FC<WhatsAppQRCodeProps> = ({ onVerified }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    // In a real app, this would fetch the QR code from WhatsApp Business API
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-example-qr');

    let interval: NodeJS.Timeout;
    if (status === 'pending' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, timer]);

  const handleRefresh = () => {
    setTimer(60);
    setStatus('pending');
    // In a real app, this would fetch a new QR code
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-example-qr-' + Date.now());
  };

  const handleVerify = () => {
    // Simulated verification
    setStatus('verified');
    if (onVerified) {
      onVerified();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="relative">
        {status === 'pending' && qrCode && (
          <>
            <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48" />
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {timer}s
              </span>
            </div>
          </>
        )}
        {status === 'verified' && (
          <div className="flex flex-col items-center justify-center w-48 h-48 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="mt-2 text-sm font-medium text-green-700">Verified</p>
          </div>
        )}
        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center w-48 h-48 bg-red-50 rounded-lg">
            <XCircle className="w-16 h-16 text-red-500" />
            <p className="mt-2 text-sm font-medium text-red-700">Failed</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {status === 'pending' && (
          <>
            <p className="text-sm text-center text-gray-500">
              Open WhatsApp on your phone and scan the QR code to link your account
            </p>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh QR
              </button>
              {/* This button is for demo purposes only */}
              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <QrCode className="w-4 h-4 mr-1" />
                Verify (Demo)
              </button>
            </div>
          </>
        )}
        {status === 'verified' && (
          <p className="text-sm text-center text-gray-500">
            Your WhatsApp account is successfully linked
          </p>
        )}
        {status === 'failed' && (
          <>
            <p className="text-sm text-center text-gray-500">
              Failed to verify WhatsApp account. Please try again.
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppQRCode;