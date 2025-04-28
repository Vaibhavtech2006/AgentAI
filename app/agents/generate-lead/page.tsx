"use client";

import React, { useState } from "react";

export default function GenerateLeadPage() {
  const [location, setLocation] = useState("");
  const [dataType, setDataType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Location:", location);
    console.log("Data Type:", dataType);
    // Yaha aap apna API call ya backend request laga sakte hain
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-3xl font-semibold mb-4">Lead Generation Portal</h2>
      <p className="text-lg max-w-xl text-center mb-8">
        Gain deeper insights, track lead behavior, and convert faster with our streamlined solution.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Enter Data Type"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-3 text-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
