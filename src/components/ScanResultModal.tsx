import React, { useState } from 'react';
import { CheckCircle, Coins, Award } from 'lucide-react';

interface ScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  pointsScanned: number;
  newTotal: number;
  bottleCount: number;
  canRedeem: boolean;
  onClaim: () => void;
  onDonate: () => void;
  onRedeem: () => void;
  showThankYou: boolean;
  showSuccess: boolean;
  successPoints: number;
}

export default function ScanResultModal({
  isOpen,
  onClose,
  pointsScanned,
  newTotal,
  bottleCount,
  canRedeem,
  onClaim,
  onDonate,
  onRedeem,
  showThankYou,
  showSuccess,
  successPoints
}: ScanResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan Complete</h2>
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-700">Bottles Scanned:</span>
            <span className="ml-2 text-2xl font-bold text-blue-600">{bottleCount}</span>
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-700">Total Points:</span>
            <span className="ml-2 text-2xl font-bold text-green-600">{newTotal}</span>
          </div>

          {!showThankYou ? (
            <>
              <div className="flex flex-col gap-4 mb-4">
                <button
                  onClick={onClaim}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Claim Points
                </button>
                <button
                  onClick={onDonate}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Donate Points
                </button>
              </div>
              {showSuccess && (
                <div className="mb-4 text-green-700 font-semibold text-lg">
                  {successPoints} points added successfully!
                </div>
              )}
            </>
          ) : (
            <div className="mb-4 text-green-700 font-semibold text-lg">
              THANK YOU, YOUR RESPONSIBLE BEHAVIOUR HELPED TURN WASTE INTO WORTH.
            </div>
          )}

          {canRedeem && (
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={onRedeem}
                className="flex items-center bg-yellow-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-600 transition-colors"
              >
                <Award className="w-6 h-6 mr-2" />
                Redeem
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}