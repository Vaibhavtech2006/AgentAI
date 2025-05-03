"use client";

import React, { useState } from 'react';

interface Lead {
  [key: string]: string;
}

const LeadChatbot: React.FC = () => {
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState('');
  const [niche, setNiche] = useState('');
  const [chat, setChat] = useState<string[]>([
    "Bot: Hello! I am your lead generation assistant.",
    "Bot: Would you like to generate business leads? (yes/no)"
  ]);
  const [userInput, setUserInput] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);  // Loading state for fetching leads

  const handleSend = async () => {
    if (!userInput.trim()) return;  // Avoid empty input

    const input = userInput.trim().toLowerCase();
    setChat(prev => [...prev, `You: ${userInput}`]);

    // Step-based logic for user interactions
    if (step === 0) {
      if (input === 'yes') {
        setChat(prev => [...prev, "Bot: Great! Enter the place name (e.g., city or area):"]);
        setStep(1);
      } else if (input === 'no') {
        setChat(prev => [...prev, "Bot: Okay, no problem. Let me know if you change your mind!"]);
        setStep(-1);
      } else {
        setChat(prev => [...prev, "Bot: Please type 'yes' or 'no'."]);
      }
    } else if (step === 1) {
      setPlace(userInput);
      setChat(prev => [...prev, "Bot: Enter the business niche (e.g., restaurant, store):"]);
      setStep(2);
    } else if (step === 2) {
      setNiche(userInput);
      setChat(prev => [...prev, "Bot: Generating leads, please wait..."]);
      setStep(3);

      // Start loading indicator
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place, niche: userInput }),
        });

        const data = await response.json();
        if (data.leads) {
          setLeads(data.leads);
          setChat(prev => [
            ...prev,
            `Bot: ${data.status}`,
            `Bot: Retrieved ${data.leads.length} leads.`
          ]);
        } else {
          setChat(prev => [...prev, "Bot: Failed to get leads."]);
        }
      } catch (error) {
        setChat(prev => [...prev, "Bot: Error connecting to server."]);
      } finally {
        // Stop loading indicator
        setIsLoading(false);
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

      {/* User input section */}
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

      {/* Show loading state */}
      {isLoading && (
        <div style={{ marginTop: '1rem', color: '#bbb' }}>
          Bot: Generating leads... Please wait.
        </div>
      )}

      {/* Display the leads table if available */}
      {leads.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Lead Results</h3>
          <table border={1} cellPadding={5} style={{ backgroundColor: '#111', color: 'white', borderColor: '#444' }}>
            <thead>
              <tr>
                {Object.keys(leads[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index}>
                  {Object.values(lead).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadChatbot;
