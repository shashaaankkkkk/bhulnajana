"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      <div className="relative h-9 w-9 bg-primary rounded-xl flex items-center justify-center font-black text-primary-foreground text-sm shadow-xl shadow-primary/20 group-hover:rotate-12 transition-all duration-300">
        <Image
          src="/flaticon.svg"
          alt="BhulnaJaana Logo"
          width={20}
          height={20}
          className="invert dark:invert-0"
        />
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tighter text-foreground">
          BhulnaJaana
        </span>
      )}
    </Link>
  );
}
