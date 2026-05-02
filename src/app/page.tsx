'use client';
import TradeApp from "@/containers/TradeApp";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log("Session data:", session);
  console.log("Session user:", session?.user);
  return (
    <>
      {session?.user ? (<TradeApp />) : (
       <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-8 pt-20 pb-8">
        <div className="w-full max-w-4xl">
          {/* Background gradient blur effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20 blur-3xl"></div>
          
          <main className="flex flex-col gap-8 items-center text-center">
            {/* Logo/Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-50"></div>
              <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                <span className="text-6xl">📊</span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="font-black text-5xl sm:text-6xl bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Trade Track
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 font-semibold">
                Professional Inventory Management
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Streamline your trade operations with intelligent inventory tracking, real-time sales monitoring, and comprehensive debt management. Built for modern traders.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
              <div className="bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm rounded-xl p-5 hover:border-blue-500/50 transition-all">
                <span className="text-3xl block mb-2">📦</span>
                <p className="text-sm font-semibold text-slate-300">Smart Inventory</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm rounded-xl p-5 hover:border-cyan-500/50 transition-all">
                <span className="text-3xl block mb-2">💰</span>
                <p className="text-sm font-semibold text-slate-300">Sales Tracking</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm rounded-xl p-5 hover:border-purple-500/50 transition-all">
                <span className="text-3xl block mb-2">💳</span>
                <p className="text-sm font-semibold text-slate-300">Debt Management</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-slate-400">
              <p className="text-sm">Sign in to get started</p>
            </div>
          </main>
        </div>
      </div>
        )}
    </>
  );
}
