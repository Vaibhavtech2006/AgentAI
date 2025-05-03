'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://cpqwepcxnzdljomotorz.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXdlcGN4bnpkbGpvbW90b3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjAwNDAsImV4cCI6MjA2MTgzNjA0MH0.2BdL8ToUwxcxuV5N5PZSr2UQC4VY8kwH9k_s2fRNe4k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase.from('leads').select('*');
        if (error) {
          console.error('Error fetching leads:', error);
          setErrorMsg('Failed to fetch leads: ' + error.message);
        } else {
          console.log('Fetched leads:', data);
          setLeads(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setErrorMsg('Unexpected error occurred. Check console.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Fields to exclude from showing (you can customize this)
  const excludeFields = ['id', 'uuid', 'created_at', 'updated_at'];

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Leads</h1>
      {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div className="space-y-3">
          {leads.length === 0 ? (
            <p>No leads found.</p>
          ) : (
            leads.map((lead, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                {Object.entries(lead)
                  .filter(
                    ([key, value]) =>
                      !excludeFields.includes(key) &&
                      value !== null &&
                      value !== ''
                  )
                  .map(([key, value], idx) => (
                    <p key={idx}>
                      <strong className="capitalize">{key}:</strong>{' '}
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : value}
                    </p>
                  ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
