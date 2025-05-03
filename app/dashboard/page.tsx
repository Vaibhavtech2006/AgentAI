'use client';
import React, { useState } from 'react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'calls' | 'emails'>('leads');

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
      activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
    }`;

  const leads = [
    { name: 'John Doe', phone: '9876543210', interest: 'AI Consulting', date: '2025-04-30' },
    { name: 'Amit Sharma', phone: '9123456789', interest: 'Voice Agent Service', date: '2025-04-28' },
    { name: 'Sara Khan', phone: '9812345678', interest: 'CRM Integration', date: '2025-04-25' }
  ];

  const calls = [
    { to: '9876543210', status: 'Picked', recording: 'https://example.com/recording1.mp3', time: '10:00 AM' },
    { to: '9123456789', status: 'Cut', recording: 'https://example.com/recording2.mp3', time: '2:15 PM' },
    { to: '9812345678', status: 'Missed', recording: '', time: '4:45 PM' }
  ];

  const emails = [
    { to: 'john@example.com', subject: 'Welcome to Vikrti.ai', reply: 'Thanks, looking forward!', sentAt: '2025-04-30' },
    { to: 'amit@business.com', subject: 'Follow-up on demo', reply: 'Can we reschedule?', sentAt: '2025-04-28' },
    { to: 'sara.k@firm.com', subject: 'Pricing Plans', reply: 'Please share more details.', sentAt: '2025-04-25' }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('leads')} className={tabClass('leads')}>Leads</button>
        <button onClick={() => setActiveTab('calls')} className={tabClass('calls')}>Calls</button>
        <button onClick={() => setActiveTab('emails')} className={tabClass('emails')}>Emails</button>
      </div>

      {activeTab === 'leads' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Previous Leads</h2>
          <div className="space-y-3">
            {leads.map((lead, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <p><strong>Name:</strong> {lead.name}</p>
                <p><strong>Phone:</strong> {lead.phone}</p>
                <p><strong>Interest:</strong> {lead.interest}</p>
                <p><strong>Date:</strong> {lead.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calls' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Call Logs</h2>
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
      )}

      {activeTab === 'emails' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Emails Sent</h2>
          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <p><strong>To:</strong> {email.to}</p>
                <p><strong>Subject:</strong> {email.subject}</p>
                <p><strong>Reply:</strong> {email.reply}</p>
                <p><strong>Sent At:</strong> {email.sentAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
