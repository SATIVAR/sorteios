"use client"

import * as React from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "sativar-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = React.useState<Theme>(defaultTheme)

    React.useEffect(() => {
        const root = window.document.documentElement

        try {
            const storedTheme = localStorage.getItem(storageKey) as Theme
            if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
                setTheme(storedTheme)
                root.classList.remove("light", "dark")
                root.classList.add(storedTheme)
            } else {
                root.classList.remove("light", "dark")
                root.classList.add(defaultTheme)
            }
        } catch (error) {
            root.classList.remove("light", "dark")
            root.classList.add(defaultTheme)
        }
    }, [defaultTheme, storageKey])

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            try {
                localStorage.setItem(storageKey, newTheme)
                const root = window.document.documentElement
                root.classList.remove("light", "dark")
                root.classList.add(newTheme)
                setTheme(newTheme)
            } catch (error) {
                console.error("Failed to save theme:", error)
            }
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}