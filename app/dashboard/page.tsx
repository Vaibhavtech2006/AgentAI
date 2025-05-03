'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://cpqwepcxnzdljomotorz.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXdlcGN4bnpkbGpvbW90b3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjAwNDAsImV4cCI6MjA2MTgzNjA0MH0.2BdL8ToUwxcxuV5N5PZSr2UQC4VY8kwH9k_s2fRNe4k';
const supabase = createClient(supabaseUrl, supabaseKey);

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'calls' | 'emails'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
      activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
    }`;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase.from('leads').select('*');

        if (error) {
          console.error('Error fetching leads:', error);
          setErrorMsg(error.message);
        } else {
          console.log('Fetched leads:', data);
          // Minimal mapping to handle missing fields safely
          const mappedLeads = data.map((item: any) => ({
            title: item.title || 'N/A',
            address: item.address || 'N/A',
            phone: item.phone || 'N/A',
            website: item.website || 'N/A',
            city: item.city || 'N/A',
            state: item.state || 'N/A',
            countryCode: item.countryCode || 'N/A',
          }));
          setLeads(mappedLeads);
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setErrorMsg('Unexpected error occurred. Check console.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('leads')} className={tabClass('leads')}>
          Leads
        </button>
        <button onClick={() => setActiveTab('calls')} className={tabClass('calls')}>
          Calls
        </button>
        <button onClick={() => setActiveTab('emails')} className={tabClass('emails')}>
          Emails
        </button>
      </div>

      {activeTab === 'leads' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Previous Leads</h2>
          {errorMsg && <p className="text-red-400 mb-4">Error: {errorMsg}</p>}
          {loading ? (
            <p>Loading leads...</p>
          ) : (
            <div className="space-y-3">
              {leads.length === 0 ? (
                <p>No leads found.</p>
              ) : (
                leads.map((lead, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded">
                    <p>
                      <strong>Title:</strong> {lead.title}
                    </p>
                    <p>
                      <strong>Address:</strong> {lead.address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {lead.phone}
                    </p>
                    <p>
                      <strong>Website:</strong> {lead.website}
                    </p>
                    <p>
                      <strong>City:</strong> {lead.city}
                    </p>
                    <p>
                      <strong>State:</strong> {lead.state}
                    </p>
                    <p>
                      <strong>Country Code:</strong> {lead.countryCode}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'calls' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Call Logs</h2>
          <p>Call logs functionality to be implemented.</p>
        </div>
      )}

      {activeTab === 'emails' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Emails Sent</h2>
          <p>Emails functionality to be implemented.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
