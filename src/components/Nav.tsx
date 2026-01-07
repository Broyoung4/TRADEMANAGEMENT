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
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
      isDarkMode && themeConfig 
        ? `${themeConfig.navBg} border-slate-700 shadow-lg` 
        : "bg-white/80 border-slate-200 shadow-md"
    }`}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo Section */}
        <Link className="flex gap-3 justify-center items-center group" href="/">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isDarkMode && themeConfig 
              ? `${themeConfig.accentBg}` 
              : "bg-blue-500"
          }`}>
            <Image
              className="object-contain"
              src={nextLogo}
              alt="logo"
              width={24}
              height={24}
            />
          </div>
          <p className={`text-lg font-bold hidden sm:block transition-colors group-hover:opacity-80 ${
            isDarkMode && themeConfig ? themeConfig.accent : "text-blue-600"
          }`}>
            Trade Track
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-2">
        {session?.user ? (
          <div className="flex gap-2 items-center">
            <Link
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDarkMode && themeConfig
                  ? `${themeConfig.text} hover:${themeConfig.accentBg} border ${themeConfig.border}`
                  : "text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
              href="/"
            >
              Dashboard
            </Link>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all text-white shadow-md ${
                isDarkMode && themeConfig
                  ? `${themeConfig.buttonBg} ${themeConfig.buttonHover}`
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="button"
              onClick={signOut}
            >
              Sign Out
            </button>

            <Link href="/profile" className="ml-2">
              <Image
                src={session?.user.image}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-offset-2 ring-slate-300 hover:ring-blue-500 transition-all"
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} hover:${themeConfig.accentBg} border ${themeConfig.border}`
                      : "text-slate-700 hover:bg-slate-100 border border-slate-300"
                  }`}
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden flex items-center gap-2">
        {session?.user ? (
          <div className="flex items-center gap-3 relative">
            <Image
              src={session?.user.image}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-slate-300 cursor-pointer hover:ring-blue-500 transition-all"
              alt="profile"
              onClick={() => {setToggleDropdown((prev) => !prev)}}
            />
            {toggleDropdown && (
              <div className={`absolute top-16 right-0 min-w-max rounded-xl shadow-lg backdrop-blur-md fade-in ${
                isDarkMode && themeConfig
                  ? `${themeConfig.bgSecondary} border ${themeConfig.border}`
                  : "bg-white border border-slate-200"
              }`}>
                <Link 
                  href='/profile' 
                  className={`block px-4 py-3 font-medium transition-colors border-b ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} border-slate-700 hover:${themeConfig.accentBg}`
                      : "text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={()=> setToggleDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className={`block px-4 py-3 font-medium transition-colors border-b ${
                    isDarkMode && themeContext
                      ? `${themeConfig.text} border-slate-700 hover:${themeConfig.accentBg}`
                      : "text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setToggleDropdown(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className={`w-full text-left px-4 py-3 font-medium transition-colors rounded-b-xl ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.buttonBg} text-white ${themeConfig.buttonHover}`
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Sign Out
                </button>
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
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} hover:${themeConfig.accentBg} border ${themeConfig.border}`
                      : "text-slate-700 hover:bg-slate-100 border border-slate-300"
                  }`}
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  </nav>
);
};

export default Nav;
