'use client';

import React from 'react';

const calls = [
  { to: '9876543210', status: 'Picked', recording: 'https://example.com/recording1.mp3', time: '10:00 AM' },
  { to: '9123456789', status: 'Cut', recording: 'https://example.com/recording2.mp3', time: '2:15 PM' },
  { to: '9812345678', status: 'Missed', recording: '', time: '4:45 PM' }
];

export default function CallsPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Calls</h1>
      <div className="space-y-3">
        {calls.map((call, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded">
            <p><strong>To:</strong> {call.to}</p>
            <p><strong>Status:</strong> {call.status}</p>
            <p><strong>Time:</strong> {call.time}</p>
            {call.recording ? (
              <p><strong>Recording:</strong> <a href={call.recording} target="_blank" className="text-blue-400">Play</a></p>
            ) : (
              <p><strong>Recording:</strong> Not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
