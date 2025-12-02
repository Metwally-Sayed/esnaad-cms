"use client"

import { useCallback, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { useThemeStore } from "@/store/theme-store"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const isDark = useThemeStore((state) => state.isDark)
  const mounted = useThemeStore((state) => state.mounted)
  const setIsDark = useThemeStore((state) => state.setIsDark)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transition API
      setIsDark(!isDark)
      return
    }

    try {
      await document.startViewTransition(() => {
        flushSync(() => {
          setIsDark(!isDark)
        })
      }).ready

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } catch (error) {
      // If animation fails, still toggle the theme
      console.error("Theme transition failed:", error)
      setIsDark(!isDark)
    }
  }, [isDark, setIsDark, duration])

  // Prevent hydration mismatch by not rendering icon until mounted
  if (!mounted) {
    return (
      <button
        ref={buttonRef}
        className={cn(className)}
        {...props}
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
