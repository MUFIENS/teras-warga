"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallbackClassName?: string;
  iconClassName?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "Avatar", fallbackClassName, iconClassName, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    // Reset error state if src changes
    React.useEffect(() => {
      setHasError(false);
    }, [src]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 select-none",
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img loading="lazy" src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-900",
              fallbackClassName
            )}
          >
            <User className={cn("h-1/2 w-1/2", iconClassName)} />
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
