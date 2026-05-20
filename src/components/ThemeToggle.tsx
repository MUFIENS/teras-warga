"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mountedRef = React.useRef(false);
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    mountedRef.current = true;
    forceUpdate();
    return () => { mountedRef.current = false; };
  }, []);

  if (!mountedRef.current) {
    return (
      <button className="rounded-full border border-gray-200 dark:border-neutral-800 p-2 flex items-center justify-center min-w-[38px] min-h-[38px] transition-colors duration-200">
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full border border-gray-200 dark:border-neutral-800 p-2 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
