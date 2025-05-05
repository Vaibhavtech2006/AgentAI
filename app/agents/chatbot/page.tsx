"use client"
import React, { useState } from 'react';
import axios from 'axios';

interface Lead {
  title: string;
  address: string;
  phone: string;
  website: string;
}

const LeadChatbot: React.FC = () => {
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState('');
  const [niche, setNiche] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState<string[]>([
    "Bot: Hello! I am your lead generation assistant.",
    "Bot: Would you like to generate business leads? (yes/no)"
  ]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setChat(prev => [...prev, `You: ${userInput}`]);

    const input = userInput.trim().toLowerCase();

    if (step === 0) {
      if (input === 'yes') {
        setChat(prev => [...prev, "Bot: Great! Please enter the place name (e.g., city or area):"]);
        setStep(1);
      } else if (input === 'no') {
        setChat(prev => [...prev, "Bot: Okay, no problem. Let me know if you change your mind!"]);
        setStep(-1);
      } else {
        setChat(prev => [...prev, "Bot: Please type 'yes' or 'no'."]);
      }
    } else if (step === 1) {
      setPlace(userInput);
      setChat(prev => [...prev, "Bot: Please enter the business niche (e.g., restaurant, store):"]);
      setStep(2);
    } else if (step === 2) {
      setNiche(userInput);
      setChat(prev => [...prev, "Bot: Generating leads, please wait..."]);
      setStep(3);

      setLoading(true);
      setMessage('Generating leads, please wait...');

      try {
        const response = await axios.post('http://localhost:5000/generate-leads', {
          place,
          niche: userInput
        });
        

        if (response.data.leads && response.data.leads.length > 0) {
          setLeads(response.data.leads);
          setMessage('Leads saved successfully!');
          setChat(prev => [...prev, "Bot: Successfully generated leads."]);
        } else {
          setMessage('No leads found.');
          setChat(prev => [...prev, "Bot: No leads found."]);
        }
      } catch (error) {
        setMessage('Error generating leads.');
        setChat(prev => [...prev, "Bot: Error generating leads."]);
      } finally {
        setLoading(false);
      }
    }

    setUserInput('');
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <h2>Lead Generation Chatbot</h2>

      <div style={{
        background: '#1a1a1a',
        padding: '1rem',
        marginBottom: '1rem',
        height: '300px',
        overflowY: 'scroll',
        border: '1px solid #444'
      }}>
        {chat.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {step !== -1 && (
        <>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              padding: '0.5rem',
              marginRight: '0.5rem',
              backgroundColor: '#222',
              color: 'white',
              border: '1px solid #555',
              width: '70%'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              width: '20%'
            }}
          >
            Send
          </button>
        </>
      )}

      {loading && (
        <div style={{ marginTop: '1rem', color: '#bbb' }}>
          Bot: Generating leads... Please wait.
        </div>
      )}

      {leads.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Lead Results</h3>
          <ul>
            {leads.map((lead, index) => (
              <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #555', paddingBottom: '0.5rem' }}>
                <p><strong>{lead.title}</strong></p>
                <p>{lead.address}</p>
                <p>{lead.phone}</p>
                <p>{lead.website}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div style={{ marginTop: '1rem', color: '#bbb' }}>
          Bot: {message}
        </div>
      )}
    </div>
  );
};

export default LeadChatbot;
