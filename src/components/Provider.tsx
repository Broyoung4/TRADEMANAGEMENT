'use client';
import React, { useState, useEffect, useLayoutEffect, createContext } from 'react'

import { SessionProvider } from 'next-auth/react';

export const ThemeContext = createContext();

const Provider = ({ children, session }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("midnight");
    const [isHydrated, setIsHydrated] = useState(false);

    // Use useLayoutEffect to sync theme before paint
    useLayoutEffect(() => {
        // Load theme preferences from localStorage
        const savedTheme = localStorage.getItem("theme");
        const savedColorTheme = localStorage.getItem("colorTheme");
        
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        }
        if (savedColorTheme) {
            setCurrentTheme(savedColorTheme);
        }
        setIsHydrated(true);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, currentTheme, setCurrentTheme }}>
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </ThemeContext.Provider>
    )
}

export default Provider