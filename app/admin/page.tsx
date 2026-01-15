"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      localStorage.setItem("admin_auth", "1234");
      router.replace("/admin/clear-db");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="bg-gray-900 p-6 rounded-lg">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
