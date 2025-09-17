import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QRScanner from './components/QRScanner';
import PointsDisplay from './components/PointsDisplay';
import LoginModal from './components/LoginModal';
import ScanResultModal from './components/ScanResultModal';
import { extractPointsFromQR } from './utils/qrUtils';
import { QrCode, Scan, Shield, Users, Award } from 'lucide-react';
import type { User } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scanResult, setScanResult] = useState<{
    points: number;
    newTotal: number;
    rawData: string;
  } | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{
    points: number;
    timestamp: Date;
    source: string;
  }>>([]);
  const [bottleCount, setBottleCount] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [canRedeem, setCanRedeem] = useState(false);
  const [showSuccess, setShowSuccess] = useState<{show: boolean, points: number}>({show: false, points: 0});

  // Initialize default user
  useEffect(() => {
    const savedUser = localStorage.getItem('segro-user');
    const savedActivity = localStorage.getItem('segro-activity');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
    
    if (savedActivity) {
      const parsedActivity = JSON.parse(savedActivity).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
      setRecentActivity(parsedActivity);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would be API call
    const user: User = {
      id: '1',
      name: 'Demo User',
      email: email,
      points: currentUser?.points || 100
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('segro-user', JSON.stringify(user));
  };

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsScannerActive(false);
      localStorage.removeItem('segro-user');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleQRScan = (qrData: string) => {
    if (!currentUser) return;
    setShowThankYou(false);
    const scannedPoints = extractPointsFromQR(qrData);
    setScanResult({
      points: scannedPoints,
      newTotal: currentUser.points, // will update on claim
      rawData: qrData
    });
    setBottleCount((prev) => prev + 1);
    setIsScannerActive(false);
  };

  const handleClaimPoints = () => {
    if (!scanResult || !currentUser) return;
    const newTotal = currentUser.points + scanResult.points;
    const updatedUser = { ...currentUser, points: newTotal };
    setCurrentUser(updatedUser);
    localStorage.setItem('segro-user', JSON.stringify(updatedUser));
    // Add to recent activity
    const newActivity = {
      points: scanResult.points,
      timestamp: new Date(),
      source: 'QR Code Scan'
    };
    const updatedActivity = [newActivity, ...recentActivity];
    setRecentActivity(updatedActivity);
    localStorage.setItem('segro-activity', JSON.stringify(updatedActivity));
    setShowSuccess({show: true, points: scanResult.points});
    setScanResult(null);
    setIsScannerActive(true);
    setTimeout(() => setShowSuccess({show: false, points: 0}), 2500);
    // Check for redeem
    if (newTotal >= 1000) setCanRedeem(true);
  };

  const handleDonatePoints = () => {
    setShowThankYou(true);
  };

  const handleRedeem = () => {
    // Example redeem logic: reset points and bottle count
    if (!currentUser) return;
    const updatedUser = { ...currentUser, points: 0 };
    setCurrentUser(updatedUser);
    localStorage.setItem('segro-user', JSON.stringify(updatedUser));
    setBottleCount(0);
    setCanRedeem(false);
    setScanResult(null);
    setIsScannerActive(true);
  };

  return (
    <>
      {showSuccess.show && (
        <div style={{position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999}}>
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg animate-bounce">
            {showSuccess.points} points added successfully!
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
      <Header 
        currentPoints={currentUser?.points || 0}
        isLoggedIn={isLoggedIn}
        onLoginToggle={handleLoginToggle}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoggedIn ? (
          // Welcome Screen
          <div className="text-center">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Segro
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Scan QR codes to earn and track your reward points instantly
                </p>
                
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>Get Started</span>
                </button>
              </div>
              
              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Scan className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Scanning</h3>
                  <p className="text-gray-600">Simply point your camera at any QR code to scan instantly</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Points</h3>
                  <p className="text-gray-600">Collect points from QR codes and track your rewards</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
                  <p className="text-gray-600">Your data and points are protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Main App Interface
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Scanner Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">QR Scanner</h2>
                  <button
                    onClick={() => setIsScannerActive(!isScannerActive)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isScannerActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isScannerActive ? 'Stop Scanner' : 'Start Scanner'}
                  </button>
                </div>
                
                {isScannerActive ? (
                  <QRScanner onScanSuccess={handleQRScan} isActive={isScannerActive} />
                ) : (
                  <div className="bg-gray-100 rounded-xl p-12 text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Scanner Ready</h3>
                    <p className="text-gray-500 mb-4">Click "Start Scanner" to begin scanning QR codes</p>
                    <div className="text-sm text-gray-400">
                      <p>• Position QR code within the camera frame</p>
                      <p>• Ensure good lighting for best results</p>
                      <p>• Hold steady until scan completes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Points Section */}
            <div>
              <PointsDisplay 
                currentPoints={currentUser?.points || 0}
                recentActivity={recentActivity}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
      />
      
      <ScanResultModal
        isOpen={!!scanResult}
        onClose={() => {
          setScanResult(null);
          setShowThankYou(false);
          setIsScannerActive(true);
        }}
        pointsScanned={scanResult?.points || 0}
        newTotal={currentUser?.points || 0}
        bottleCount={bottleCount}
        canRedeem={canRedeem || (currentUser?.points || 0) >= 1000}
        onClaim={handleClaimPoints}
        onDonate={handleDonatePoints}
        onRedeem={handleRedeem}
        showThankYou={showThankYou}
        showSuccess={showSuccess.show}
        successPoints={showSuccess.points}
      />
    </div>
    </>
  );
}

export default App;