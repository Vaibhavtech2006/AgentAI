'use client';

import React from 'react';

const emails = [
  { sender: 'info@example.com', subject: 'Proposal Follow-up', date: '2025-04-30' },
  { sender: 'support@aiagent.com', subject: 'Service Update', date: '2025-04-29' },
  { sender: 'sales@company.com', subject: 'New Package Options', date: '2025-04-28' },
];

export default function EmailsPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Emails</h1>
      <div className="space-y-3">
        {emails.map((email, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded">
            <p><strong>Sender:</strong> {email.sender}</p>
            <p><strong>Subject:</strong> {email.subject}</p>
            <p><strong>Date:</strong> {email.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
