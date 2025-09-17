import React from 'react';
import { Coins, TrendingUp, Award } from 'lucide-react';

interface PointsDisplayProps {
  currentPoints: number;
  recentActivity: Array<{
    points: number;
    timestamp: Date;
    source: string;
  }>;
}

export default function PointsDisplay({ currentPoints, recentActivity }: PointsDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Points</h2>
        <Award className="w-8 h-8 text-yellow-500" />
      </div>

      {/* Current Points */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
          </div>
          <Coins className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">+{activity.points} points</p>
                  <p className="text-sm text-gray-500">{activity.source}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}