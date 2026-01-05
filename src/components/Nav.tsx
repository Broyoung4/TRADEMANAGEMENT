"use client";

import Image from "next/image";
import React, { useContext } from "react";
import Link from "next/link";
import nextLogo from '../../public/globe.svg';
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { ThemeContext } from "./Provider";

// Theme Configuration
const THEMES = {
  midnight: {
    name: "Midnight Blue",
    dark: {
      bg: "bg-slate-950",
      bgSecondary: "bg-slate-900",
      text: "text-slate-100",
      textSecondary: "text-slate-400",
      border: "border-slate-700",
      accent: "text-blue-400",
      accentBg: "bg-blue-900",
      accentLight: "bg-blue-800",
      navBg: "bg-slate-900",
      buttonBg: "bg-blue-700",
      buttonHover: "hover:bg-blue-600",
    },
  },
  forest: {
    name: "Forest Green",
    dark: {
      bg: "bg-emerald-950",
      bgSecondary: "bg-emerald-900",
      text: "text-emerald-50",
      textSecondary: "text-emerald-400",
      border: "border-emerald-700",
      accent: "text-green-400",
      accentBg: "bg-green-900",
      accentLight: "bg-green-800",
      navBg: "bg-emerald-900",
      buttonBg: "bg-green-700",
      buttonHover: "hover:bg-green-600",
    },
  },
  sunset: {
    name: "Sunset Orange",
    dark: {
      bg: "bg-orange-950",
      bgSecondary: "bg-orange-900",
      text: "text-orange-50",
      textSecondary: "text-orange-300",
      border: "border-orange-700",
      accent: "text-amber-400",
      accentBg: "bg-amber-900",
      accentLight: "bg-amber-800",
      navBg: "bg-orange-900",
      buttonBg: "bg-amber-700",
      buttonHover: "hover:bg-amber-600",
    },
  },
  amethyst: {
    name: "Amethyst Purple",
    dark: {
      bg: "bg-purple-950",
      bgSecondary: "bg-purple-900",
      text: "text-purple-50",
      textSecondary: "text-purple-300",
      border: "border-purple-700",
      accent: "text-fuchsia-400",
      accentBg: "bg-fuchsia-900",
      accentLight: "bg-fuchsia-800",
      navBg: "bg-purple-900",
      buttonBg: "bg-fuchsia-700",
      buttonHover: "hover:bg-fuchsia-600",
    },
  },
  crimson: {
    name: "Crimson Red",
    dark: {
      bg: "bg-red-950",
      bgSecondary: "bg-red-900",
      text: "text-red-50",
      textSecondary: "text-red-300",
      border: "border-red-700",
      accent: "text-rose-400",
      accentBg: "bg-rose-900",
      accentLight: "bg-rose-800",
      navBg: "bg-red-900",
      buttonBg: "bg-rose-700",
      buttonHover: "hover:bg-rose-600",
    },
  },
  ocean: {
    name: "Ocean Cyan",
    dark: {
      bg: "bg-cyan-950",
      bgSecondary: "bg-cyan-900",
      text: "text-cyan-50",
      textSecondary: "text-cyan-300",
      border: "border-cyan-700",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900",
      accentLight: "bg-cyan-800",
      navBg: "bg-cyan-900",
      buttonBg: "bg-cyan-700",
      buttonHover: "hover:bg-cyan-600",
    },
  },
};

const Nav = () => {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode = false, currentTheme = "midnight" } = themeContext || {};

  //const isLoggedIn = true;

  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const themeConfig = isDarkMode ? THEMES[currentTheme]?.dark : {};

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
    <nav className={`fixed flex justify-between items-center w-full py-3 px-4 mb-32 transition-colors duration-300 ${
      isDarkMode && themeConfig ? `${themeConfig.navBg} ${themeConfig.text}` : "bg-white text-slate-900"
    }`}>
      <Link className="flex gap-2 justify-center items-center" href="/">
        <Image
          className="object-contain"
          src={nextLogo}
          alt="logo"
          width={30}
          height={30}
        />
        <p className={`text-md font-extrabold sm:flex hidden ${isDarkMode ? themeConfig.accent : "text-blue-600"}`}>Trade Track</p>
      </Link>


      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link
              className={`border px-2 py-1 rounded transition-colors ${
                isDarkMode
                  ? `${themeConfig.border} ${themeConfig.text} hover:${themeConfig.accentBg}`
                  : "border-slate-300 bg-transparent hover:bg-neutral-400"
              }`}
              href="/inventory"
            >
              Add Inventory
            </Link>
            <button
              className={`border px-2 py-1 rounded transition-colors ${
                isDarkMode
                  ? `${themeConfig.buttonBg} ${themeConfig.text} border-transparent ${themeConfig.buttonHover}`
                  : "border-neutral-950 bg-slate-500 text-neutral-950 hover:bg-neutral-950 hover:text-neutral-200"
              }`}
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
                  className={`border px-2 py-1 rounded transition-colors ${
                    isDarkMode
                      ? `${themeConfig.border} ${themeConfig.text} hover:${themeConfig.accentBg}`
                      : "border-slate-300 bg-transparent hover:bg-neutral-400"
                  }`}
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
                <div className={`w-32 absolute top-12 right-0 p-2 rounded-lg slide-in-top transition-colors ${
                  isDarkMode ? `${themeConfig.bgSecondary} ${themeConfig.border} border` : "bg-neutral-800"
                }`}>
                  <Link href='/profile' 
                  className={`text-md block my-2 transition-colors ${isDarkMode ? `${themeConfig.text} hover:${themeConfig.accent}` : "hover:text-blue-400"}`}
                  onClick={()=> setToggleDropdown(false)}
                  >Profile</Link>
                  <Link href='/inventory' 
                  className={`text-md block my-2 transition-colors ${isDarkMode ? `${themeConfig.text} hover:${themeConfig.accent}` : "hover:text-blue-400"}`}
                  onClick={()=> setToggleDropdown(false)}
                  >Add Inventory</Link>
                  <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className={`mt-5 w-full border px-2 py-1 rounded transition-colors ${
                    isDarkMode
                      ? `${themeConfig.buttonBg} ${themeConfig.text} border-transparent ${themeConfig.buttonHover}`
                      : "border-slate-300 bg-transparent hover:bg-neutral-400"
                  }`}
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
                  className={`border px-2 py-1 rounded transition-colors ${
                    isDarkMode
                      ? `${themeConfig.border} ${themeConfig.text} hover:${themeConfig.accentBg}`
                      : "border-slate-300 bg-transparent hover:bg-neutral-400"
                  }`}
                >Sign In</button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
