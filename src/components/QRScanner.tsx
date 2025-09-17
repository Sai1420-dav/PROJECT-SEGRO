import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, CameraOff, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScanSuccess, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        setDebugInfo(`Scanned: ${result.data.substring(0, 50)}...`);
        if (result.data !== lastScan) {
          setLastScan(result.data);
          onScanSuccess(result.data);
          setIsScanning(false);
          setTimeout(() => setDebugInfo(''), 3000);
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: 'environment',
        maxScansPerSecond: 5,
        calculateScanRegion: (video) => {
          const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
          const scanRegionSize = Math.round(0.7 * smallestDimension);
          return {
            x: Math.round((video.videoWidth - scanRegionSize) / 2),
            y: Math.round((video.videoHeight - scanRegionSize) / 2),
            width: scanRegionSize,
            height: scanRegionSize,
          };
        },
      }
    );

    scanner.setInversionMode('both');
    setQrScanner(scanner);

    return () => {
      scanner.destroy();
    };
  }, [onScanSuccess]);

  useEffect(() => {
    if (qrScanner) {
      if (isActive) {
        qrScanner.start().then(() => {
          setDebugInfo('Camera started successfully');
          setTimeout(() => setDebugInfo(''), 2000);
        }).catch((error) => {
          console.error('Camera start error:', error);
          setDebugInfo(`Camera error: ${error.message}`);
          setHasCamera(false);
        });
        setIsScanning(true);
      } else {
        qrScanner.stop();
        setIsScanning(false);
        setDebugInfo('');
      }
    }

    return () => {
      if (qrScanner && isActive) {
        qrScanner.stop();
      }
    };
  }, [qrScanner, isActive]);

  if (!hasCamera) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <CameraOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Camera Access Required</h3>
        <p className="text-red-600">
          Please allow camera access to scan QR codes. Refresh the page and grant camera permissions.
        </p>
        {debugInfo && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-700">{debugInfo}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-900 rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full aspect-square object-cover"
          style={{ maxHeight: '400px' }}
          playsInline
          muted
        />
      
        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Corner brackets */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
          
            {/* Scanning area */}
            <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
              {isScanning ? (
                <div className="text-center">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-white text-sm">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-white/75 mx-auto mb-2" />
                  <p className="text-white/75 text-sm">Position QR Code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isScanning ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">{debugInfo}</p>
          </div>
        </div>
      )}

      {/* Scanning Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Scanning Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Hold your device steady and ensure good lighting</li>
          <li>• Position the QR code within the scanning frame</li>
          <li>• Try moving closer or further from the QR code</li>
          <li>• Make sure the QR code is not damaged or blurry</li>
        </ul>
      </div>
    </div>
  );
}