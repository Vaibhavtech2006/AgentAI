"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormData {
  prompt: string;
  first_message: string;
  number: string;
}

export default function StartCallPage() {
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    first_message: "",
    number: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  
    try {
      const response = await axios.post(
        '/api/savecall',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      alert('Call data saved successfully!');
    } catch (error) {
      console.error('Error saving call data:', error);
      alert('Failed to save call data.');
    }
  };
  

    

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-black">
          Start a New Call
        </h2>

        <div>
          <label className="block text-black font-medium mb-2">Prompt</label>
          <textarea
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-black font-medium mb-2">
            First Message
          </label>
          <textarea
            name="first_message"
            value={formData.first_message}
            onChange={handleChange}
            rows={2}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-black font-medium mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="+91XXXXXXXXXX"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Start Call
        </button>
      </form>
    </div>
  );
}
