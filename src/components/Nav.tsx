"use client";

import Image from "next/image";
import React, { useContext } from "react";
import Link from "next/link";
import nextLogo from '../../public/globe.svg';
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { ThemeContext } from "./Provider";

// Modern & Elegant Theme Configuration for Nav
const THEMES = {
  midnight: {
    name: "Midnight Blue",
    dark: {
      bg: "bg-slate-950",
      bgSecondary: "bg-slate-900",
      text: "text-slate-100",
      textSecondary: "text-slate-400",
      border: "border-slate-700",
      borderLight: "border-slate-600",
      accent: "text-blue-400",
      accentBg: "bg-blue-900/40",
      accentLight: "bg-blue-800/40",
      navBg: "bg-slate-950/80",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-500",
      buttonText: "text-white",
      navBorder: "border-slate-700/50",
      navShadow: "shadow-lg shadow-blue-900/10",
    },
  },
  forest: {
    name: "Forest Green",
    dark: {
      bg: "bg-emerald-950",
      bgSecondary: "bg-emerald-900",
      text: "text-emerald-50",
      textSecondary: "text-emerald-300",
      border: "border-emerald-700",
      borderLight: "border-emerald-600",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-900/40",
      accentLight: "bg-emerald-800/40",
      navBg: "bg-emerald-950/80",
      buttonBg: "bg-emerald-600",
      buttonHover: "hover:bg-emerald-500",
      buttonText: "text-white",
      navBorder: "border-emerald-700/50",
      navShadow: "shadow-lg shadow-emerald-900/10",
    },
  },
  sunset: {
    name: "Sunset Orange",
    dark: {
      bg: "bg-orange-950",
      bgSecondary: "bg-orange-900",
      text: "text-orange-50",
      textSecondary: "text-orange-200",
      border: "border-orange-700",
      borderLight: "border-orange-600",
      accent: "text-amber-400",
      accentBg: "bg-amber-900/40",
      accentLight: "bg-amber-800/40",
      navBg: "bg-orange-950/80",
      buttonBg: "bg-amber-600",
      buttonHover: "hover:bg-amber-500",
      buttonText: "text-white",
      navBorder: "border-orange-700/50",
      navShadow: "shadow-lg shadow-amber-900/10",
    },
  },
  amethyst: {
    name: "Amethyst Purple",
    dark: {
      bg: "bg-purple-950",
      bgSecondary: "bg-purple-900",
      text: "text-purple-50",
      textSecondary: "text-purple-200",
      border: "border-purple-700",
      borderLight: "border-purple-600",
      accent: "text-fuchsia-400",
      accentBg: "bg-fuchsia-900/40",
      accentLight: "bg-fuchsia-800/40",
      navBg: "bg-purple-950/80",
      buttonBg: "bg-fuchsia-600",
      buttonHover: "hover:bg-fuchsia-500",
      buttonText: "text-white",
      navBorder: "border-purple-700/50",
      navShadow: "shadow-lg shadow-fuchsia-900/10",
    },
  },
  crimson: {
    name: "Crimson Red",
    dark: {
      bg: "bg-red-950",
      bgSecondary: "bg-red-900",
      text: "text-red-50",
      textSecondary: "text-red-200",
      border: "border-red-700",
      borderLight: "border-red-600",
      accent: "text-rose-400",
      accentBg: "bg-rose-900/40",
      accentLight: "bg-rose-800/40",
      navBg: "bg-red-950/80",
      buttonBg: "bg-rose-600",
      buttonHover: "hover:bg-rose-500",
      buttonText: "text-white",
      navBorder: "border-red-700/50",
      navShadow: "shadow-lg shadow-rose-900/10",
    },
  },
  ocean: {
    name: "Ocean Cyan",
    dark: {
      bg: "bg-cyan-950",
      bgSecondary: "bg-cyan-900",
      text: "text-cyan-50",
      textSecondary: "text-cyan-200",
      border: "border-cyan-700",
      borderLight: "border-cyan-600",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-900/40",
      accentLight: "bg-cyan-800/40",
      navBg: "bg-cyan-950/80",
      buttonBg: "bg-cyan-600",
      buttonHover: "hover:bg-cyan-500",
      buttonText: "text-white",
      navBorder: "border-cyan-700/50",
      navShadow: "shadow-lg shadow-cyan-900/10",
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
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
      isDarkMode && themeConfig 
        ? `${themeConfig.navBg} ${themeConfig.navBorder} ${themeConfig.navShadow}` 
        : "bg-white/90 border-slate-200/50 shadow-lg"
    }`}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Logo Section */}
        <Link className="flex gap-3 justify-center items-center group" href="/">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isDarkMode && themeConfig 
              ? `${themeConfig.accentBg} border ${themeConfig.borderLight}` 
              : "bg-gradient-to-br from-blue-500 to-blue-600"
          } group-hover:scale-110`}>
            <Image
              className="object-contain"
              src={nextLogo}
              alt="logo"
              width={24}
              height={24}
            />
          </div>
          <p className={`text-lg font-bold hidden sm:block transition-all duration-300 ${
            isDarkMode && themeConfig ? themeConfig.accent : "text-blue-600"
          }`}>
            Trade Track
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-3">
        {session?.user ? (
          <div className="flex gap-3 items-center">
            <Link
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode && themeConfig
                  ? `${themeConfig.text} border ${themeConfig.borderLight} ${themeConfig.accentBg} hover:border-opacity-100 border-opacity-50`
                  : "text-slate-700 hover:bg-slate-50 border border-slate-300"
              }`}
              href="/"
            >
              Dashboard
            </Link>
            <button
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                isDarkMode && themeConfig
                  ? `${themeConfig.buttonBg} ${themeConfig.buttonText} ${themeConfig.buttonHover} transform hover:scale-105`
                  : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
              }`}
              type="button"
              onClick={signOut}
            >
              Sign Out
            </button>

            <Link href="/profile" className="ml-2 group">
              <Image
                src={session?.user.image}
                width={40}
                height={40}
                className={`rounded-full ring-2 transition-all duration-300 group-hover:scale-110 group-hover:ring-offset-2 ${
                  isDarkMode && themeConfig
                    ? `ring-blue-500/50 group-hover:ring-blue-400`
                    : "ring-blue-400 group-hover:ring-blue-500"
                }`}
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
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} border ${themeConfig.borderLight} ${themeConfig.accentBg} hover:border-opacity-100 border-opacity-50`
                      : "text-slate-700 hover:bg-slate-50 border border-slate-300"
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
              className={`rounded-full ring-2 cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                isDarkMode && themeConfig
                  ? "ring-blue-500/50 hover:ring-blue-400"
                  : "ring-blue-400 hover:ring-blue-500"
              }`}
              alt="profile"
              onClick={() => {setToggleDropdown((prev) => !prev)}}
            />
            {toggleDropdown && (
              <div className={`absolute top-16 right-0 min-w-max rounded-xl shadow-2xl backdrop-blur-md fade-in border ${
                isDarkMode && themeConfig
                  ? `${themeConfig.bgSecondary} ${themeConfig.borderLight}`
                  : "bg-white/95 border border-slate-200"
              }`}>
                <Link 
                  href='/profile' 
                  className={`block px-5 py-3.5 font-medium transition-all duration-300 border-b ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} ${themeConfig.borderLight} hover:${themeConfig.accentBg}`
                      : "text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={()=> setToggleDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/"
                  className={`block px-5 py-3.5 font-medium transition-all duration-300 border-b ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} ${themeConfig.borderLight} hover:${themeConfig.accentBg}`
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
                  className={`w-full text-left px-5 py-3.5 font-medium transition-all duration-300 rounded-b-xl ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.buttonBg} ${themeConfig.buttonText} ${themeConfig.buttonHover}`
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isDarkMode && themeConfig
                      ? `${themeConfig.text} hover:${themeConfig.accentBg} border ${themeConfig.borderLight}`
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
