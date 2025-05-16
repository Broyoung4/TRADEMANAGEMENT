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
       <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
         <h1 className="font-black sm:text-3xl text-2xl">Trade Track</h1>
         <p className="text-lg font-semibold">Add Items to your Virtual Inventory and track your trade</p>
         </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
        )}
    </>
  );
}
