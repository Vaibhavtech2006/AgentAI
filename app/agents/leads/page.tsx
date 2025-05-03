'use client';

import React from 'react';

const leads = [
  { name: 'John Doe', phone: '9876543210', interest: 'AI Consulting', date: '2025-04-30' },
  { name: 'Amit Sharma', phone: '9123456789', interest: 'Voice Agent Service', date: '2025-04-28' },
  { name: 'Sara Khan', phone: '9812345678', interest: 'CRM Integration', date: '2025-04-25' }
];

export default function LeadsPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Leads</h1>
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
  );
}

