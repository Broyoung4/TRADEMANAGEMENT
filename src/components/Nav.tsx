"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import nextLogo from '../../public/globe.svg';
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  //const isLoggedIn = true;

  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setProvidersIn = async () => {
      const response = await getProviders();

      setProviders(response);
    };
    setProvidersIn();
  }, []);
  console.log(`providers`, providers);
  console.log(`session`, session);

  return (
    <nav className="fixed flex justify-between items-center w-full py-3 px-4 mb-32">
      <Link className="flex gap-2 justify-center items-center" href="/">
        <Image
          className="object-contain"
          src={nextLogo}
          alt="logo"
          width={30}
          height={30}
        />
        <p className="text-md font-extrabold sm:flex hidden">Trade Track</p>
      </Link>


      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link
              className="border border-slate-300 bg-transparent px-2 py-1 rounded hover:bg-neutral-400 focus-within:bg-neutral-400"
              href="/inventory"
            >
              Add Inventory
            </Link>
            <button
              className="border border-neutral-950 bg-slate-500 text-neutral-950 px-2 py-1 rounded hover:bg-neutral-950 
        hover:text-neutral-200
        hover:border-neutral-500  
        focus-within:bg-neutral-950"
              type="button"
              onClick={signOut}
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="border border-slate-300 bg-transparent px-2 py-1 rounded hover:bg-neutral-400 focus-within:bg-neutral-400"
                >Sign In</button>
              ))}
          </>
        )}
      </div>
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
                onClick={() => {setToggleDropdown((prev) => !prev)}}
              />
              {toggleDropdown && (
                <div className="w-32 absolute top-12 right-0 bg-neutral-800 p-2 rounded-lg slide-in-top">
                  <Link href='/profile' 
                  className="text-md block my-2"
                  onClick={()=> setToggleDropdown(false)}
                  >Profile</Link>
                  <Link href='/inventory' 
                  className="text-md block my-2"
                  onClick={()=> setToggleDropdown(false)}
                  >Add Inventory</Link>
                  <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className=" mt-5 w-full border border-slate-300 bg-transparent px-2 py-1 rounded hover:bg-neutral-400 focus-within:bg-neutral-400"
                >Sign Out</button>
                </div>
              )}
          </div>
        ): (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="border border-slate-300 bg-transparent px-2 py-1 rounded hover:bg-neutral-400 focus-within:bg-neutral-400"
                >Sign In</button>
              ))}
          </>
        )}
      </div>

    </nav>
  );
};

export default Nav;
