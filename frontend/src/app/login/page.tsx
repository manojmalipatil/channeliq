"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      // Set a mock cookie/localstorage if needed, but we'll just redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('channeliq_auth', 'true');
      }
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl animate-slide-up">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/30 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-textPrimary text-center mb-2 tracking-tight">Welcome to ChannelIQ</h1>
        <p className="text-sm text-textMuted text-center mb-8">Enter your credentials to access the orchestrator</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-textPrimary uppercase tracking-widest mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="admin@channeliq.ai"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-textPrimary uppercase tracking-widest mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">
            Secure Enterprise Login
          </p>
        </div>
      </div>
    </div>
  );
}
